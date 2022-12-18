import './Root.css';

import { FC, Suspense, useEffect } from 'react';
import { Await, Outlet, ScrollRestoration, useLoaderData, useLocation } from 'react-router-dom';

import { UserDTO } from '../../api/typings';
import { BurgerMenu } from '../../components/BurgerMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Paths } from '../../config/constants';
import { appSelectors, authActions, useAppDispatch, useAppSelector } from '../../store';
import { ResponseType } from '../../utils/HTTP';

export const Root: FC = () => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;
  const dispatch = useAppDispatch();

  const data = useLoaderData() as { user: Promise<ResponseType<UserDTO>> };

  useEffect(() => {
    if (data) {
      data.user.then(response => {
        if (response) {
          return dispatch(authActions.setUserProfile(response.data));
        }
        return null;
      });
    }
  }, [data]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader data-testid={'fallback-loader'} />}>
        <Await resolve={(data && data.user) || Promise.resolve()}>
          <main className="layout">
            <header>
              <BurgerMenu />
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
    </ErrorBoundary>
  );
};
