import type * as express from 'express';
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
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

export function render(streamOptions: RenderToPipeableStreamOptions, request: express.Request) {
  const loadedPath = request.originalUrl;
  const router = createMemoryRouter(routes, {
    initialEntries: [loadedPath],
  });

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
