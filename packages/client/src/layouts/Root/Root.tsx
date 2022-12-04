import './Root.css';

import { FC, Suspense } from 'react';
import { Await, Outlet, ScrollRestoration, useLoaderData, useLocation, useNavigation } from 'react-router-dom';

import { UserDTO } from '../../api/typings';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Menu } from '../../components/Menu';
import { Paths } from '../../config/constants';
import { appSelectors, authActions, useAppDispatch, useAppSelector } from '../../store';
import { Response } from '../../utils/HTTP';
import { RootProps } from './typings';

export const Root: FC<RootProps> = ({ children }) => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;

  const data = useLoaderData() as { user: Promise<Response<UserDTO>> };
  const dispatch = useAppDispatch();

  if (data) data.user.then(response => response && dispatch(authActions.setUserProfile(response.data)));

  return (
    <Suspense fallback={<Loader />}>
      <Await
        resolve={(data && data.user) || Promise.resolve()}
        children={
          <main className={'layout'}>
            <header>
              <Menu />
              {printHeaderAndFooter && <Logo />}
              {printHeaderAndFooter && <div className="delimiter" />}
            </header>
            <Outlet />
            {children}
            {printHeaderAndFooter && <Footer />}
            <ScrollRestoration />
            {isAppLoading && <Loader />}
          </main>
        }
      />
    </Suspense>
  );
};
