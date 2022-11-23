import { createBrowserRouter } from 'react-router-dom';

import Layout from '../layouts/Root';
import ErrorPage from '../pages/ErrorPage';
import Hello from '../pages/Hello';
import Home from '../pages/Home';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'hello/:topic',
        element: <Hello />,
      },
    ],
  },
]);

export default router;
