import dotenv from 'dotenv';
import { type ViteDevServer, createServer as createViteServer } from 'vite';

import { asyncLocalStorage, corsMiddleware, requestDataSaverMiddleware } from './middlewares';
import { apiRoute } from './routes/Api';
import { initMongoDBConnection, initPostgreDBConnection } from './utils/databaseUtils';

dotenv.config();

import axios from 'axios';
import express from 'express';
import { expressCspHeader } from 'express-csp-header';
import * as path from 'path';

import { getCspDirectives } from './config/cspDirectives';
import { SSRRoute } from './routes/SSR';
import { isDev } from './utils/isDev';

initPostgreDBConnection();
initMongoDBConnection();

/**
 * Задаем глобальный interceptor для axios, который достает из TLS (https://pjatk.in/tls-in-node.html)
 * куки, которые записали в requestDataSaverMiddleware, что дает возможность авторизоваться
 * серверу при запросах к API, но не воздействует на запросы с клиента
 **/

axios.interceptors.request.use(config => {
  const contextStore = asyncLocalStorage.getStore() as Map<string, unknown>;
  const userCookies = contextStore?.get('userCookies');
  config.headers['Cookie'] = userCookies;
  return config;
});

async function startServer() {
  const app = express();

  const serverPort = Number(process.env.SERVER_PORT) || 5000;

  let vite: ViteDevServer | undefined;

  /** Для работы SSR необходимо получить пути к директориям client репозитория */
  const distPath = path.dirname(require.resolve('client/dist/index.html'));
  const srcPath = path.dirname(require.resolve('client'));

  app
    // Инициализация middleware
    .use([corsMiddleware(), requestDataSaverMiddleware])

    /** Запросы к API на собственном сервере и на сервере Яндекса (проксируется через наш сервер) */
    .use('/api', apiRoute)

    /** Пробрасываем статичный файл serviceWorker */
    .use('/serviceWorker.js', express.static(path.resolve(distPath, 'serviceWorker.js')));

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

  /** Обрабатываем все остальные запросы к серверу */
  app.use('*', expressCspHeader({ directives: getCspDirectives() }), SSRRoute({ vite, srcPath, distPath }));

  app.listen(serverPort, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${serverPort}`);
  });
}

startServer();
