import dotenv from 'dotenv';
import type { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { type ViteDevServer, createServer as createViteServer } from 'vite';

import { corsMiddleware } from './middlewares';
import { apiRoute } from './routes/Api';
import { initMongoDBConnection, initPostgreDBConnection } from './utils/databaseUtils';

dotenv.config();

import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { HtmlWritable } from './utils/HtmlWritable';

initPostgreDBConnection();
initMongoDBConnection();

const isDev = () => process.env.NODE_ENV === 'development';

async function startServer() {
  const app = express();

  const serverPort = Number(process.env.SERVER_PORT) || 5000;

  // Инициализация middleware
  app.use(corsMiddleware());

  let vite: ViteDevServer | undefined;

  /** Для работы SSR необходимо получить пути к директориям client репозитория */
  const distPath = path.dirname(require.resolve('client/dist/index.html'));
  const ssrClientPath = require.resolve('client/dist-ssr/ssr.cjs');
  const srcPath = path.dirname(require.resolve('client'));

  /** Запросы к API на собственном сервере и на сервере Яндекса (проксируется через наш сервер) */
  app.use('/api', apiRoute);

  /**
   * В случае dev режима работы сервера подключаем vite middleware
   * для работы HMR (hot module reload). Модуль делает обновление
   * необходимых частей приложения на лету при изменениях в коде
   */
  if (isDev()) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: srcPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  }

  /** Для production сборки необходимо "пробросить" статичные файлы  из директории assets */
  if (!isDev()) {
    app.use('/assets', express.static(path.resolve(distPath, 'assets')));
  }

  /** Пробрасываем статичный файл serviceWorker */
  app.use('/serviceWorker.js', express.static(path.resolve(distPath, 'serviceWorker.js')));

  /** Обрабатываем все остальные запросы к серверу */
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;

      let render: (
        streamOptions: RenderToPipeableStreamOptions,
        request: express.Request
      ) => Promise<{
        /**
         * Не подключаю сюда полноценную типизацию, чтобы не подключать пакет
         * Redux toolkit в пакет server ради типизации одного объекта. Нам нужен
         * только один метод getState
         */
        store: { getState: () => Record<string, unknown> };
        stream: ReturnType<typeof renderToPipeableStream>;
      }>;
      /**
       * Считываем index.html и render функцию из клиентского пакета
       */
      if (isDev() && vite) {
        /**
         * Для Dev режима используются исходные файлы + делаем обработку
         * через вспомогательные функции Vite для Dev разработки
         **/
        template = fs.readFileSync(path.resolve(srcPath, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule(path.resolve(srcPath, 'ssr.tsx'))).render;
      } else {
        /** Для production режима берем файлы и модули из сборки */
        template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
        render = (await import(ssrClientPath)).render;
      }

      /**
       * В ssr.tsx используется renderToPipeableStream вместо renderToString.
       * Нам нужно перехватить события заверешния стрима и уже в нем подставить
       * HTML код приложения в index.html
       */
      let didError = false;

      const { stream, store } = await render(
        {
          /**
           * В случае завершения работы stream указываем статус ответа в зависимости
           * от успешного или неуспешного выполнения рендера приложения, задаем headers
           * и передаем в рендер "собранное" в HtmlWritable тело ответа
           **/
          onShellReady() {
            res.status(didError ? 500 : 200).setHeader('Content-type', 'text/html');
            stream.pipe(writable);
          },
          onShellError() {
            res.statusCode = 500;
            res.send('<!doctype html><p>Error loading app...</p>');
          },
          onError(err) {
            didError = true;
            console.error(err);
          },
        },
        req
      );

      /**
       * Данное решение используется для обработки stream.
       * В данном случае нам необходимо собрать данные буфера в строку,
       * после этого берем шаблон (взятое из index.html ранее) и вставлем
       * в него полученные данные, включая начальное состояние store
       */
      const writable = new HtmlWritable();
      writable.on('finish', () => {
        const helmet = Helmet.renderStatic();
        const appHtml = writable.getHtml();

        const responseHtml = template
          .replace(
            `<div id="root" class="root"><!--ssr-outlet--></div>`,
            `<div id="root" class="root">${appHtml}</div>
            <script>
                window.__PRELOADED_STATE__=${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}
            </script>`
          )
          .replace(
            `<!--helmet-outlet-->`,
            `
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
            `
          );

        res.send(responseHtml);
      });
    } catch (e) {
      /** В dev режиме форматируем stack trace ошибки для удобства чтения и анализа */
      if (isDev()) {
        vite?.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  });

  app.listen(serverPort, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${serverPort}`);
  });
}

startServer();
