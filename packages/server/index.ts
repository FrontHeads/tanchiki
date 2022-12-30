import cors from 'cors';
import dotenv from 'dotenv';
import type { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';
import type { createMemoryRouter } from 'react-router-dom';
// import { type ViteDevServer, createServer as createViteServer, ModuleNode } from 'vite';
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

  // app.use(express.static(distPath));

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;

      let render: (
        streamOptions: RenderToPipeableStreamOptions,
        request: express.Request
      ) => Promise<{
        stream: ReturnType<typeof renderToPipeableStream>;
        router: ReturnType<typeof createMemoryRouter>;
      }>;

      if (isDev() && vite) {
        template = fs.readFileSync(path.resolve(srcPath, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule(path.resolve(srcPath, 'ssr.tsx'))).render;
      } else {
        template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
        render = (await import(ssrClientPath)).render;
      }

      /**
       * В ssr.tsx используется renderToPipeableStream вместо renderToHtml.
       * Нам нужно перехватить события заверешния стрима и уже в нем подставить
       * HTML код приложения в index.html
       */
      let didError = false;

      const { stream, router } = await render(
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

      console.log(router);

      const writable = new HtmlWritable();
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

// /**
//  * Collect SSR CSS for Vite
//  */
// export const componentsModules = (components: string[], vite: ViteDevServer) => {
//   const matchedModules = new Set<ModuleNode>();
//   components.forEach(component => {
//     const modules = vite.moduleGraph.getModulesByFile(component);
//     modules?.forEach(mod => matchedModules.add(mod));
//   });
//   return matchedModules;
// };

// export const collectCss = (
//   mods: Set<ModuleNode>,
//   styles = new Map<string, string>(),
//   checkedComponents = new Set()
// ) => {
//   for (const mod of mods) {
//     if (
//       (mod.file?.endsWith('.scss') || mod.file?.endsWith('.css') || mod.id?.includes('vue&type=style')) &&
//       mod.ssrModule
//     ) {
//       styles.set(mod.url, mod.ssrModule.default);
//     }
//     if (mod.importedModules.size > 0 && !checkedComponents.has(mod.id)) {
//       checkedComponents.add(mod.id);
//       collectCss(mod.importedModules, styles, checkedComponents);
//     }
//   }
//   let result = '';
//   styles.forEach((content, id) => {
//     const styleTag = `<style type="text/css" vite-module-id="${hashCode(id)}">${content}</style>`;
//     result = result.concat(styleTag);
//   });
//   return result;
// };

// const hashCode = (moduleId: string) => {
//   let hash = 0,
//     i,
//     chr;
//   if (moduleId.length === 0) return hash;
//   for (i = 0; i < moduleId.length; i++) {
//     chr = moduleId.charCodeAt(i);
//     hash = (hash << 5) - hash + chr;
//     hash |= 0; // Convert to 32bit integer
//   }
//   return hash;
// };
