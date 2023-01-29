import './Root.css';

import { type FC, Suspense } from 'react';
import { Await, Outlet, ScrollRestoration, useLoaderData, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { type UserDTO } from '../../api/typings';
import { BurgerMenu } from '../../components/BurgerMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Paths } from '../../config/constants';
import { appSelectors, authActions, useAppDispatch, useAppSelector } from '../../store';
import { type ResponseType } from '../../utils/HTTP';

export const Root: FC = () => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;
  const dispatch = useAppDispatch();

  const loaderData = useLoaderData() as { user: Promise<ResponseType<UserDTO>> };

  if (typeof loaderData?.user?.then === 'function') {
    loaderData.user.then(response => {
      const profileData = response ? response.data : null;
      return dispatch(authActions.setUserProfile(profileData));
    });
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader data-testid={'fallback-loader'} />}>
        <Await resolve={(loaderData && loaderData.user) || Promise.resolve()}>
          <main className="layout">
            <header>
              <BurgerMenu />
              {printHeaderAndFooter ? <Logo /> : null}
              {printHeaderAndFooter ? <div className="delimiter" /> : null}
            </header>
            <Outlet />
            {printHeaderAndFooter ? <Footer /> : null}

            <ScrollRestoration />
            {isAppLoading ? <Loader data-testid="app-loader" /> : null}
          </main>
        </Await>
      </Suspense>
      <ToastContainer theme="dark" position={toast.POSITION.TOP_CENTER} />
    </ErrorBoundary>
  );
};
