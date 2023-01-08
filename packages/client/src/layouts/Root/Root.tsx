import './Root.css';

import { FC, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { authAPI } from '../../api/authAPI';
import { BurgerMenu } from '../../components/BurgerMenu';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Paths } from '../../config/constants';
import { appActions, appSelectors, authActions, useAppDispatch, useAppSelector } from '../../store';

export const Root: FC = () => {
  const isAppLoading = useAppSelector(appSelectors.isAppLoading);
  const location = useLocation();
  const printHeaderAndFooter = location?.pathname !== Paths.Game;
  const dispatch = useAppDispatch();

  // Preload and check user data
  useEffect(() => {
    authAPI
      .me()
      .catch(() => null)
      .then(response => {
        if (response) {
          dispatch(authActions.setUserProfile(response.data));
        }
      })
      .finally(() => dispatch(appActions.setIsLoading(false)));
  }, []);

  if (isAppLoading) {
    return <Loader data-testid="app-loader" />;
  }

  return (
    <ErrorBoundary>
      <main className="layout">
        <header>
          <BurgerMenu />
          {printHeaderAndFooter ? <Logo /> : null}
          {printHeaderAndFooter ? <div className="delimiter" /> : null}
        </header>
        <Outlet />
        {printHeaderAndFooter ? <Footer /> : null}
        <ScrollRestoration />
      </main>
      <ToastContainer theme="dark" position={toast.POSITION.TOP_CENTER} />
    </ErrorBoundary>
  );
};
