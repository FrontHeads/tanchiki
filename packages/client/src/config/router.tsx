import { createBrowserRouter } from 'react-router-dom';

import { Root } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { UserProfile } from '../pages/UserProfile';
import { Game } from '../pages/Game';
import { Paths } from './constants';

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: Paths.Home,
        element: <Home />,
      },
      {
        path: Paths.SignIn,
        element: <SignIn />,
      },
      {
        path: Paths.UserProfile,
        element: <UserProfile />,
      },
      {
        path: Paths.SignUp,
        element: <SignUp />,
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
