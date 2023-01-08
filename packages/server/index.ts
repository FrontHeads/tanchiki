import cors from 'cors';
import dotenv from 'dotenv';
import type { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';
import { type ViteDevServer, createServer as createViteServer } from 'vite';

import { createClientAndConnect } from './db';

dotenv.config();

import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { HtmlWritable } from './utils/HtmlWritable';

createClientAndConnect();

const isDev = () => process.env.NODE_ENV === 'development';

async function startServer() {
  const app = express();

  const clientPort = Number(process.env.CLIENT_PORT) || 3000;
  const serverPort = Number(process.env.SERVER_PORT) || 3001;

  /** Настройка CORS для корректной отдчаи проекта на клиентском порту при локальной разработке */
  const corsOptions = {
    credentials: true,
    origin: [`http://127.0.0.1:${clientPort}`, `http://localhost:${clientPort}`],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));

  let vite: ViteDevServer | undefined;

  /** Для работы SSR необходимо получить пути к директориям client репозитория */
  const distPath = path.dirname(require.resolve('client/dist/index.html'));
  const ssrClientPath = require.resolve('client/dist-ssr/ssr.cjs');
  const srcPath = path.dirname(require.resolve('client'));

  app.get('/api', (_, res) => {
    res.json('👋 Howdy from the server :)');
  });

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
      ) => Promise<ReturnType<typeof renderToPipeableStream>>;

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

      const stream = await render(
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
            res.send('<!doctype html><p>Loading...</p><script src="clientrender.js"></script>');
          },
          onError(err) {
            didError = true;
            console.error(err);
          },
        },
        req
      );

      /**
       * Пример установки начального state для Redux хранилища.
       * После реализации oAuth здесь можно подгрузить данные
       * авторизованного пользователя для корректно работы разделов
       * приложения, в которых необходима авторизацияы
       **/
      const preloadedState = {
        app: { isAppLoading: false },
      };

      /**
       * Данное решение используется для обработки stream.
       * В данном случае нам необходимо собрать данные буфера в строку,
       * после этого берем шаблон (взятое из index.html ранее) и вставлем
       * в него полученные данные, включая начальное состояние store
       */
      const writable = new HtmlWritable();
      writable.on('finish', () => {
        const appHtml = writable.getHtml();
        const responseHtml = template.replace(
          `<div id="root" class="root"><!--ssr-outlet--></div>`,
          `<div id="root" class="root">${appHtml}</div>
            <script>
                window.__PRELOADED_STATE__=${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>`
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
