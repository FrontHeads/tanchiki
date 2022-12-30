import { createStaticHandler } from '@remix-run/router';
import type * as express from 'express';
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';
import { Provider } from 'react-redux';
// import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import { toast, ToastContainer } from 'react-toastify';
import { UpdatePayload } from 'vite/types/hmrPayload';

import { routes } from './src/config/router';
import { store } from './src/store';

/**
 * Client listener to detect updated modules through HMR, and remove the initial styled attached to the head
 */
export const removeCssHotReloaded = () => {
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', (module: UpdatePayload) => {
      module.updates.forEach(update => {
        const moduleStyle = document.querySelector(`[vite-module-id="${hashCode(update.acceptedPath)}"]`);
        if (moduleStyle) {
          moduleStyle.remove();
        }
      });
    });
  }
};

const hashCode = (moduleId: string) => {
  let hash = 0,
    i,
    chr;
  if (moduleId.length === 0) return hash;
  for (i = 0; i < moduleId.length; i++) {
    chr = moduleId.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

removeCssHotReloaded();

export async function render(streamOptions: RenderToPipeableStreamOptions, request: express.Request) {
  // const loadedPath = request.originalUrl;
  // const router = createMemoryRouter(routes, {
  //   initialEntries: [loadedPath],
  // });

  const { query } = createStaticHandler(routes);
  const remixRequest = createFetchRequest(request);
  const context = await query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(routes, context);

  return {
    stream: renderToPipeableStream(
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
        <ToastContainer theme="dark" position={toast.POSITION.TOP_CENTER} />
      </Provider>,
      streamOptions
    ),
    router,
  };
}

export function createFetchHeaders(requestHeaders: express.Request['headers']): Headers {
  const headers = new Headers();

  for (const [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

export function createFetchRequest(req: express.Request): Request {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();

  req.on('close', () => {
    controller.abort();
  });

  const init: RequestInit = {
    method: req.method,
    headers: createFetchHeaders(req.headers),
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
