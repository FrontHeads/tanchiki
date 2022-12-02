import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { router } from './config/router';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer theme="dark" position={toast.POSITION.TOP_CENTER} />
  </Provider>
);
