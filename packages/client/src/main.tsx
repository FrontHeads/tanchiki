import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './config/router';
import { setupStore } from './store';
import { registerServiceWorker, unregisterServiceWorker } from './utils/serviceWorkerUtils';

/**
 * Активируем SW только в production режиме
 * В противном случае удаляем все активные SW
 */
if (import.meta.env.PROD) {
  registerServiceWorker();
} else {
  unregisterServiceWorker();
}

const router = createBrowserRouter(routes);
const store = setupStore();

const rootElement = document.getElementById('root') as HTMLElement;
const app = (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

/**
 * В случае, если содержимое было сгенерировано на сервере -
 * делаем hydrate (цепляемся к верстке). В противном случае
 * делаем обычный рендер.
 * Необходимо для корреткной работы на github pages, когда
 * используется SPA сборка, а не SSR
 **/
if (rootElement.innerHTML === '<!--ssr-outlet-->') {
  ReactDOM.createRoot(rootElement).render(app);
} else {
  ReactDOM.hydrateRoot(rootElement, app);
}
