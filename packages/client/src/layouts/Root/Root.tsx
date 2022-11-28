import './Root.css';

import { Outlet, useNavigation } from 'react-router-dom';

import { Footer } from '../../components/Footer';
import { Paths } from '../../config/constants';

export const Root: React.FC = () => {
  const navigation = useNavigation();

  return (
    <main className={['layout', `layout_state_${navigation.state}`].join(' ')}>
      <header>Hello</header>
      <Outlet />
      {navigation.location?.pathname !== Paths.Game && <Footer />}
    </main>
  );
};
