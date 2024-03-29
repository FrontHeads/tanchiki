import { createStaticHandler } from '@remix-run/router';
import axios from 'axios';
import type * as express from 'express';
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { getRoutes } from './src/config/router';
import { setupStore } from './src/store';

export async function render(streamOptions: RenderToPipeableStreamOptions, request: express.Request) {
  const store = setupStore();
  const routes = getRoutes(store.dispatch);

  const { query } = createStaticHandler(routes);
  const remixRequest = createFetchRequest(request);
  const context = await query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(routes, context);

  /**
   * В связи с тем, что в приложении используется React.Suspend-> Await -
   * нужно использовать renderToPipeableStream вместо renderToString.
   * При этом возвращается stream, а не строка, который нужно
   * обрабатывать на стороне сервера
   * https://github.com/reactwg/react-18/discussions/22
   * Так же возвращаем store, который был сформирован на сервере, чтобы
   * на клиенте отрендерить preloadedState
   */

  return {
    stream: renderToPipeableStream(
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} />
      </Provider>,
      streamOptions
    ),
    store,
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

export { axios };
export { Helmet };
