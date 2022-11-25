import './Root.css';

import { Outlet, useNavigation } from 'react-router-dom';

export const Root: React.FC = () => {
  const navigation = useNavigation();

  return (
    <div className={['layout', `layout_state_${navigation.state}`].join(' ')}>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
