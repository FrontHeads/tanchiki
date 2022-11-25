import './Root.css';

import { Outlet, useNavigation } from 'react-router-dom';

export const Root: React.FC = () => {
  const navigation = useNavigation();

  return (
    <main className={['layout', `layout_state_${navigation.state}`].join(' ')}>
      <Outlet />
    </main>
  );
};
