import { createBrowserRouter } from 'react-router-dom';

import { Root } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
import { SignIn } from '../pages/SignIn';
import { Paths } from './constants';

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: Paths.SignIn,
        element: <SignIn />,
      }
    ],
  },
]);
