import './Root.css';

import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { Paths } from '../../config/constants';

import { Menu } from '../../components/Menu';

export const Root: React.FC = () => {
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
