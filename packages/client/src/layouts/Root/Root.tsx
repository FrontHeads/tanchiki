import './Root.css';

import { FC } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import { Menu } from '../../components/Menu';
import { RootProps } from './typings';

export const Root: FC<RootProps> = ({ children }) => {
  const navigation = useNavigation();

  return (
    <main className={['layout', `layout_state_${navigation.state}`].join(' ')}>
      <Menu />
      <Outlet />
      {children}
    </main>
  );
};
