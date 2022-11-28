import './Root.css';

import { Outlet, useNavigation } from 'react-router-dom';

import { appSelectors, useAppSelector } from '../../store';

export const Root: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = useAppSelector(appSelectors.isLoading);
  const loadingState = navigation.state !== 'idle' || isLoading ? 'loading' : 'idle';

  return (
    <main className={['layout', `layout_state_${loadingState}`].join(' ')}>
      <Outlet />
    </main>
  );
};
