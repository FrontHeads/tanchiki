import { lazy, Suspense } from 'react';
import { type LoaderFunction, createRoutesFromElements, Link, Route } from 'react-router-dom';

import { ProtectedRoutes } from '../components/ProtectedRoutes';
import { PublicRoutes } from '../components/PublicRoutes';
import { Root as RootLayout } from '../layouts/Root';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { UserProfile } from '../pages/UserProfile';
import { type AppDispatch } from '../store';
import { authThunks } from '../store/features/auth/authThunks';
import { aboutLoader } from './aboutRoute';
import { Paths } from './constants';
import { forumRoutes } from './forumRoutes';
import { leaderboardLoader } from './leaderboardRoute';

/** Делаем "ленивую" подгрузку игры только в момент перехода в соответствующий раздел */
const Game = lazy(() => import('../pages/Game').then(module => ({ default: module.Game })));

/**
  Делаем предзагрузку данных пользователя, проверяя - авторизован или нет catch сделан,
  чтобы в случае ошибки (куки не валидны, пользователь не авторизован) пользователю не
  отображалось это сообщение, т.к. при проверке авторизации в этом нет необходимости
*/

export const rootLoader = (dispatch: AppDispatch): LoaderFunction => {
  return () => {
    const user = dispatch(authThunks.me(false)).unwrap();
    return { user };
  };
};

export function getRoutes(dispatch: AppDispatch) {
  return createRoutesFromElements(
    <>
      <Route element={<RootLayout />} errorElement={<ErrorPage />} loader={rootLoader(dispatch)}>
        <Route path={Paths.Home} element={<Home />}></Route>
        <Route path={Paths.ContactUs} element={<Contact />}></Route>
        <Route
          path={Paths.Game}
          element={
            <Suspense>
              <Game />
            </Suspense>
          }></Route>

        <Route element={<PublicRoutes />}>
          <Route path={Paths.SignIn} element={<SignIn />}></Route>
          <Route path={Paths.SignUp} element={<SignUp />}></Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path={Paths.UserProfile} element={<UserProfile />}></Route>
          <Route path={Paths.Leaderboard} element={<Leaderboard />} loader={leaderboardLoader(dispatch)}></Route>
          <Route
            path={Paths.Forum}
            handle={{
              crumb: () => <Link to={Paths.Forum}>Форум</Link>,
            }}>
            {forumRoutes()}
          </Route>
        </Route>
        <Route path={Paths.About} element={<About />} loader={aboutLoader()}></Route>
      </Route>
      <Route path={Paths.Error500} element={<ErrorPage status="500" message="Что-то пошло не так" />}></Route>
    </>
  );
}
