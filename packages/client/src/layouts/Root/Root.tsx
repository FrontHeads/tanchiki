import './Root.css';

import { FC, Suspense, useEffect } from 'react';
import { Await, Outlet, ScrollRestoration, useLoaderData, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { UserDTO } from '../../api/typings';
import { BurgerMenu } from '../../components/BurgerMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Paths } from '../../config/constants';
import { rootLoader } from '../../config/router';
import { appSelectors, authActions, oauthThunks, useAppDispatch, useAppSelector } from '../../store';
import { ResponseType } from '../../utils/HTTP';

export const Root: FC = () => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;
  const dispatch = useAppDispatch();

  let data = useLoaderData() as { user: Promise<ResponseType<UserDTO>> };

  useEffect(() => {
    const oauthCode = new URLSearchParams(window.location.search).get('code');

    if (oauthCode) {
      dispatch(oauthThunks.tryOAuth(oauthCode));
    }
  }, [dispatch]);

  useEffect(() => {
    /**
     * В React Router 6.6.1 была добавлена функция createStaticRouter и StaticRouterProvider,
     * необходимые для создания data роутера для SSR. Однако, в этой версии по какой-то причине
     * не происходит обработка loader для роута (смотри router.tsx). В связи с этим сделан данный хак -
     * проверяем наличие Promise для пользователя в data.user и если его нет, то вызываем rootLoader
     * вручную.
     * Потрачено много времени на поиск решения проблемы, но по createStaticRouter пока еще мало информации
     * в интернете.
     */
    if (typeof data?.user?.then !== 'function') {
      data = rootLoader() as { user: Promise<ResponseType<UserDTO>> };
    }

    data.user.then(response => {
      if (response) {
        return dispatch(authActions.setUserProfile(response.data));
      }
      return null;
    });
  }, [data]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader data-testid={'fallback-loader'} />}>
        <Await resolve={(data && data.user) || Promise.resolve()}>
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
