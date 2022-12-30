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
  const port = Number(process.env.SERVER_PORT) || 3001;

  const corsOptions = {
    credentials: true,
    origin: [`http://127.0.0.1:${clientPort}`, `http://localhost:${clientPort}`],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));

  let vite: ViteDevServer | undefined;
  const distPath = path.dirname(require.resolve('client/dist/index.html'));
  const ssrClientPath = require.resolve('client/dist-ssr/ssr.cjs');
  const srcPath = path.dirname(require.resolve('client'));

  app.get('/api', (_, res) => {
    res.json('👋 Howdy from the server :)');
  });

  if (isDev()) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: srcPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  }

  if (!isDev()) {
    app.use('/assets', express.static(path.resolve(distPath, 'assets')));
  }

  app.use('/serviceWorker.js', express.static(path.resolve(distPath, 'serviceWorker.js')));

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;

      let render: (
        streamOptions: RenderToPipeableStreamOptions,
        request: express.Request
      ) => Promise<ReturnType<typeof renderToPipeableStream>>;

      if (isDev() && vite) {
        template = fs.readFileSync(path.resolve(srcPath, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule(path.resolve(srcPath, 'ssr.tsx'))).render;
      } else {
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

      /** Пример установки штатного state */
      const preloadedState = {
        app: { isAppLoading: false },
      };

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
      if (isDev()) {
        vite?.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
  });
}

startServer();
