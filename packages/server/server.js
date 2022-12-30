import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { Writable } from 'stream';

export class HtmlWritable2 extends Writable {
  chunks = [];
  html = '';

  getHtml() {
    return this.html;
  }

  _write(chunk, _encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }

  _final(callback) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

export async function createServer(isProd = process.env.NODE_ENV === 'production', hmrPort) {
  const resolve = p => path.resolve(__dirname, p);

  const indexProd = isProd ? fs.readFileSync(resolve('client/dist/client/index.html'), 'utf-8') : '';
  const srcPath = path.dirname(resolve('../client/client'));

  const app = express();
console.log('srcPath', srcPath);
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root: srcPath,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import('compression')).default());
    app.use(
      (await import('serve-static')).default(resolve('client/dist/client'), {
        index: false,
      })
    );
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('../client/index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('client/ssr.tsx')).render;
      } else {
        template = indexProd;
        render = (await import('client/dist/server/ssr.tsx')).render;
      }
      let didError = false;

      const context = {};

      const appHtml = await render({
          onShellReady() {
            res.status(didError ? 500 : 200).setHeader('Content-type', 'text/html');
            appHtml.stream.pipe(writable);
          },
          onShellError() {
            res.statusCode = 500;
            res.send('<!doctype html><p>Loading...</p><script src="clientrender.js"></script>');
          },
          onError(err) {
            didError = true;
            console.error(err);
          },
      }, req);
      
       const writable = new HtmlWritable2();
       writable.on('finish', () => {
         const appHtml = writable.getHtml();
         const responseHtml = template.replace(`<!--ssr-outlet-->`, appHtml);

         // const componentsToRender = router.getMatchedComponents();
         // const componentsPath = componentsToRender.map(component => component.options.__file);
         // const matchedModules = componentsModules(componentsPath, vite);
         // const css = collectCss(matchedModules);

         // responseHtml = responseHtml.replace('<!--dev-ssr-css-->', css);

         res.send(responseHtml);
       });

      // console.log(appHtml);
      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      // const html = template.replace(`<!--ssr-outlet-->`, appHtml.stream);

      // res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log('http://localhost:5173');
    })
  );
}
