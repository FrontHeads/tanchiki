import { createBrowserRouter } from 'react-router-dom';

import { Root } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { UserProfile } from '../pages/UserProfile';
import { Paths } from './constants';
import { Forum } from '../pages/Forum';
import { ForumSection } from '../pages/Forum/ForumSection';
import { ForumTopic } from '../pages/Forum/ForumTopic';

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
        path: Paths.Forum,
        children: [
          {
            index: true,
            element: <Forum />,
          },
          {
            path: `${Paths.Section}/:sectionId`,
            children: [
              {
                index: true,
                element: <ForumSection />,
              },
              {
                path: `${Paths.Section}/:sectionId/${Paths.Topic}/:topicId`,
                element: <ForumTopic />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
