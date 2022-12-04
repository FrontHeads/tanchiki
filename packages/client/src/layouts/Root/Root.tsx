import './Root.css';

import { FC, Suspense, useEffect } from 'react';
import { Await, Outlet, ScrollRestoration, useLoaderData, useLocation } from 'react-router-dom';

import { UserDTO } from '../../api/typings';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Menu } from '../../components/Menu';
import { Paths } from '../../config/constants';
import { appSelectors, authActions, useAppDispatch, useAppSelector } from '../../store';
import { Response } from '../../utils/HTTP';

export const Root: FC = () => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;
  const dispatch = useAppDispatch();

  const data = useLoaderData() as { user: Promise<Response<UserDTO>> };
  useEffect(() => {
    if (data) data.user.then(response => response && dispatch(authActions.setUserProfile(response.data)));
  }, [data]);

  return (
    <Suspense fallback={<Loader data-testid={'fallback-loader'} />}>
      <Await resolve={(data && data.user) || Promise.resolve()}>
        <main className="layout">
          <header>
            <Menu />
            {printHeaderAndFooter && <Logo />}
            {printHeaderAndFooter && <div className="delimiter" />}
          </header>
          <Outlet />
          {printHeaderAndFooter && <Footer />}
          <ScrollRestoration />
          {isAppLoading && <Loader data-testid="app-loader" />}
        </main>
      </Await>
    </Suspense>
  );
};
