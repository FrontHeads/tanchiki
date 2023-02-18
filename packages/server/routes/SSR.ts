import type { Axios } from 'axios';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import type { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import type { ViteDevServer } from 'vite';

import { asyncLocalStorage } from '../middlewares';
import { HtmlWritable } from '../utils/HtmlWritable';
import { isDev } from '../utils/isDev';

type SSRRouteParams = { vite: ViteDevServer | undefined; srcPath: string; distPath: string };

type Client = {
  axios: Axios;
  render: (
    streamOptions: RenderToPipeableStreamOptions,
    request: Request
  ) => Promise<{
    /**
     * Не подключаю сюда полноценную типизацию, чтобы не подключать пакет
     * Redux toolkit в пакет server ради типизации одного объекта. Нам нужен
     * только один метод getState
     */
    store: { getState: () => Record<string, unknown> };
    stream: ReturnType<typeof renderToPipeableStream>;
  }>;
};

export const SSRRoute = ({ vite, srcPath, distPath }: SSRRouteParams): RequestHandler => {
  const ssrClientPath = require.resolve('client/dist-ssr/ssr.cjs');

  return async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template: string;
      let client: Client;
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
        client = (await vite.ssrLoadModule(path.resolve(srcPath, 'ssr.tsx'))) as Client;
      } else {
        /** Для production режима берем файлы и модули из сборки */
        template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
        client = (await import(ssrClientPath)) as Client;
      }

      console.log('-'.padEnd(100, '-'));

      console.log(client.axios.interceptors);

      /**
       * Задаем глобальный interceptor для axios из пакета client, который достает из TLS
       * (https://pjatk.in/tls-in-node.html) куки, которые записали в requestDataSaverMiddleware,
       * что дает возможность авторизоваться серверу при запросах к API, но не воздействует
       * на запросы с клиента
       **/
      client.axios.interceptors.request.clear();
      client.axios.interceptors.request.use(config => {
        const contextStore = asyncLocalStorage.getStore() as Map<string, unknown>;
        const userCookies = contextStore?.get('userCookies');
        console.log('userCookies', userCookies);
        console.log(config.headers['Cookie']);
        config.headers['Cookie'] = userCookies;

        console.log(config.url);
        console.log(config.headers['Cookie']);
        console.log(client.axios.interceptors);
        return config;
      });

      /**
       * В ssr.tsx используется renderToPipeableStream вместо renderToString.
       * Нам нужно перехватить события заверешния стрима и уже в нем подставить
       * HTML код приложения в index.html
       */
      let didError = false;

      const { stream, store } = await client.render(
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
        // config => {
        //   const contextStore = asyncLocalStorage.getStore() as Map<string, unknown>;
        //   const userCookies = contextStore?.get('userCookies');
        //   console.log('userCookies', userCookies);
        //   config.headers['Cookie'] = userCookies;
        //   return config;
        // }
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
          )
          .replaceAll(/<script/g, `<script nonce="${req.nonce}"`);

        res.send(responseHtml);
      });
    } catch (e) {
      /** В dev режиме форматируем stack trace ошибки для удобства чтения и анализа */
      if (isDev()) {
        vite?.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  };
};
