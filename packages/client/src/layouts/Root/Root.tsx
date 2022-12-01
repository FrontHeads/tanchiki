import './Root.css';

import cn from 'classnames';
import { FC } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { Logo } from '../../components/Logo';
import { Menu } from '../../components/Menu';
import { Paths } from '../../config/constants';
import { appSelectors, useAppSelector } from '../../store';
import { RootProps } from './typings';

export const Root: FC<RootProps> = ({ children }) => {
  const navigation = useNavigation();
  const isAppLoading = useAppSelector(appSelectors.isLoading);
  const isLoading = navigation.state !== 'idle' || isAppLoading;
  const location = useLocation();

  const rootElementClassNames = cn('layout', {
    layout_state_loading: isLoading,
    layout_state_idle: !isLoading,
  });

  return (
    <main className={rootElementClassNames}>
      <header>
        <Menu />
        {location?.pathname !== Paths.Game && (
          <>
            <Logo />
            <div className="delimiter" />
          </>
        )}
      </header>
      <Outlet />
      {children}
      {location?.pathname !== Paths.Game && <Footer />}
      {isLoading && <Loader />}
    </main>
  );
};
