import { FC } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { router } from './config/router';
import { store } from './store';

export const App: FC = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer theme="dark" position={toast.POSITION.TOP_CENTER} />
  </Provider>
);
