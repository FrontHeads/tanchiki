import { createBrowserRouter } from 'react-router-dom';

import { Root } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { Game } from '../pages/Game';
import { Hello } from '../pages/Hello';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
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
      },
      {
        path: Paths.SignUp,
        element: <SignUp />,
      },
      {
        path: 'hello/:topic',
        element: <Hello />,
      },
      {
        path: Paths.Leaderboard,
        element: <Leaderboard />,
      },
      {
        path: Paths.Game,
        element: <Game />,
      },
    ],
  },
]);
