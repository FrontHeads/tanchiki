import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { authAPI } from '../api/authAPI';
import { ProtectedRoutes } from '../components/ProtectedRoutes';
import { PublicRoutes } from '../components/PublicRoutes';
import { Root as RootLayout } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { Game } from '../pages/Game';
import { Home } from '../pages/Home';
import { Leaderboard } from '../pages/Leaderboard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { UserProfile } from '../pages/UserProfile';
import { Paths } from './constants';

/*
  Делаем предзагрузку данных пользователя, проверяя - авторизован или нет catch сделан,
  чтобы в случае ошибки (куки не валидны, пользователь не авторизован) пользователю не
  отображалось это сообщение, т.к. при проверке авторизации в этом нет необходимости
*/
export const rootLoader = () => {
  const user = authAPI.me().catch(() => null);
  return { user };
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />} errorElement={<ErrorPage />} loader={rootLoader}>
        <Route path={Paths.Home} element={<Home />}></Route>

        <Route element={<PublicRoutes />}>
          <Route path={Paths.SignIn} element={<SignIn />}></Route>
          <Route path={Paths.SignUp} element={<SignUp />}></Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path={Paths.UserProfile} element={<UserProfile />}></Route>
          <Route path={Paths.Leaderboard} element={<Leaderboard />}></Route>
          <Route path={Paths.Game} element={<Game />}></Route>
        </Route>
      </Route>
      <Route path={Paths.Error500} element={<ErrorPage status="500" message="Что-то пошло не так" />}></Route>
    </>
  )
);
