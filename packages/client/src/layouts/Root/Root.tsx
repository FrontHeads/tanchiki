import './Root.css';

import { type FC, Suspense, useEffect } from 'react';
import { Await, Outlet, ScrollRestoration, useLoaderData, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { type UserProfile } from '../../app.typings';
import { BurgerMenu } from '../../components/BurgerMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { PATH, Paths } from '../../config/constants';
import { appSelectors, oauthThunks, useAppDispatch, useAppSelector } from '../../store';
import { type ResponseType } from '../../utils/HTTP';

export const Root: FC = () => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;
  const dispatch = useAppDispatch();

  const loaderData = useLoaderData() as { user: Promise<ResponseType<UserProfile>> };

  useEffect(() => {
    const oauthCode = new URLSearchParams(window.location.search).get('code');
    if (oauthCode) {
      // Меняем url страницы на чистый, без code
      window.history.pushState({}, '', PATH.oauthRedirect);

      // Отправляем запрос на oauth авторизацию
      dispatch(oauthThunks.signInOauth(oauthCode));
    }
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader data-testid={'fallback-loader'} />}>
        <Await resolve={loaderData.user}>
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
