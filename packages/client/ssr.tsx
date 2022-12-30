import type * as express from 'express';
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { routes } from './src/config/router';
import { store } from './src/store';

export function render(streamOptions: RenderToPipeableStreamOptions, request: express.Request) {
  const loadedPath = request.originalUrl;
  const router = createMemoryRouter(routes, {
    initialEntries: [loadedPath],
  });

  /**
   * В связи с тем, что в приложении используется React.Suspend -
   * нужно использовать renderToPipeableStream вместо renderToHtml.
   * При этом возвращается stream, а не строка, который нужно
   * обрабатывать на стороне сервера
   */
  return {
    stream: renderToPipeableStream(
      <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer theme="dark" position={toast.POSITION.TOP_CENTER} />
      </Provider>,
      streamOptions
    ),
    router,
  };
}
