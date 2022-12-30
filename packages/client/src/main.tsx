import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './config/router';
import { store } from './store';
import { registerServiceWorker } from './utils/serviceWorkerUtils';

registerServiceWorker();

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
