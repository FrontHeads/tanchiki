import { lazy, Suspense } from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';

import { authAPI } from '../api/authAPI';
import { oauthAPI } from '../api/oauthAPI';
import { ProtectedRoutes } from '../components/ProtectedRoutes';
import { PublicRoutes } from '../components/PublicRoutes';
import { Root as RootLayout } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { Forum } from '../pages/Forum';
import { ForumSection } from '../pages/Forum/ForumSection';
import { ForumTopic } from '../pages/Forum/ForumTopic';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { UserProfile } from '../pages/UserProfile';
import { PATH, Paths } from './constants';

/** Делаем "ленивую" подгрузку игры только в момент перехода в соответствующий раздел */
const Game = lazy(() => import('../pages/Game').then(module => ({ default: module.Game })));

/**
  Делаем предзагрузку данных пользователя, проверяя - авторизован или нет catch сделан,
  чтобы в случае ошибки (куки не валидны, пользователь не авторизован) пользователю не
  отображалось это сообщение, т.к. при проверке авторизации в этом нет необходимости
*/
export const rootLoader = () => {
  let oauthCode: string | null = null;

  // Получаем код только при работе в браузере
  if (typeof window !== 'undefined') {
    oauthCode = new URLSearchParams(window.location.search).get('code');

    if (oauthCode) {
      // Меняем url страницы на чистый, без code
      window.history.pushState({}, '', PATH.oauthRedirect);

      // Отправляем запрос на oauth авторизацию
      const user = oauthAPI
        .postOauth({ code: oauthCode, redirect_uri: PATH.oauthRedirect })
        .catch(() => null)
        .finally(() => {
          return authAPI.me().catch(() => null);
        });
      return { user };
    }
  }

  const user = authAPI.me().catch(() => null);
  return { user };
};

export const routes = createRoutesFromElements(
  <>
    <Route element={<RootLayout />} errorElement={<ErrorPage />} loader={rootLoader}>
      <Route path={Paths.Home} element={<Home />}></Route>
      <Route path={Paths.Leaderboard} element={<Leaderboard />}></Route>
      <Route
        path={Paths.Game}
        element={
          <Suspense fallback={<>Загрузка...</>}>
            <Game />
          </Suspense>
        }></Route>

      <Route element={<PublicRoutes />}>
        <Route path={Paths.SignIn} element={<SignIn />}></Route>
        <Route path={Paths.SignUp} element={<SignUp />}></Route>
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path={Paths.UserProfile} element={<UserProfile />}></Route>
        <Route path={Paths.Forum}>
          <Route index={true} element={<Forum />}></Route>
          <Route path={`${Paths.Section}/:sectionId`}>
            <Route index={true} element={<ForumSection />}></Route>
            <Route path={`${Paths.Section}/:sectionId/${Paths.Topic}/:topicId`} element={<ForumTopic />}></Route>
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path={Paths.Error500} element={<ErrorPage status="500" message="Что-то пошло не так" />}></Route>
  </>
);
