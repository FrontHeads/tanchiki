import cors from 'cors';
import dotenv from 'dotenv';
import type { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';
import { type ViteDevServer, createServer as createViteServer } from 'vite';

import { createClientAndConnect } from './db';
import { HtmlWritable } from './utils/HtmlWritable';

dotenv.config();

import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

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
  const ssrClientPath = require.resolve('client/dist-ssr/client.cjs');
  const srcPath = path.dirname(require.resolve('client'));

  if (isDev()) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: srcPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  }

  app.get('/api', (_, res) => {
    'client/dist-ssr/client.cjs';
    res.json('👋 Howdy from the server :)');
  });

  if (!isDev()) {
    app.use('/assets', express.static(path.resolve(distPath, 'assets')));
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;

      if (isDev() && vite) {
        template = fs.readFileSync(path.resolve(srcPath, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
      }

      let render: (streamOptions: RenderToPipeableStreamOptions) => Promise<ReturnType<typeof renderToPipeableStream>>;

      if (isDev() && vite) {
        render = (await vite.ssrLoadModule(path.resolve(srcPath, 'ssr.tsx'))).render;
      } else {
        render = (await import(ssrClientPath)).render;
      }

      let didError = false;
      const writable = new HtmlWritable();
      writable.on('finish', () => {
        const appHtml = writable.getHtml();
        const responseHtml = template.replace(`<!--ssr-outlet-->`, appHtml);
        res.send(responseHtml);
      });

      const stream = await render({
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
