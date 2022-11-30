import './Root.css';

import { FC } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { Menu } from '../../components/Menu';
import { Paths } from '../../config/constants';

export const Root: FC = () => {
  const navigation = useNavigation();
  const location = useLocation();

  return (
    <main className={['layout', `layout_state_${navigation.state}`].join(' ')}>
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
      {location?.pathname !== Paths.Game && <Footer />}
    </main>
  );
};
