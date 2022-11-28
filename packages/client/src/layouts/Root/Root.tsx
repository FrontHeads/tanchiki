import './Root.css';

import { Outlet, useNavigation } from 'react-router-dom';

import { Loader } from '../../components/Loader';
import { appSelectors, useAppSelector } from '../../store';

export const Root: React.FC = () => {
  const navigation = useNavigation();
  const isAppLoading = useAppSelector(appSelectors.isLoading);
  const isLoading = navigation.state !== 'idle' || isAppLoading;

  return (
    <main className={['layout', `layout_state_${isLoading ? 'loading' : 'idle'}`].join(' ')}>
      <Outlet />
      {isLoading && <Loader />}
    </main>
  );
};
