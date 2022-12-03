import './Navigation.css';

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authThunks, useAppDispatch } from '../../store';
import { uiActions } from '../../store/features/ui/ui-slice';
import { MenuLink } from '../MenuLink';
import { navigationList } from './data';

export const Navigation: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clickHandler = async (id: string | number) => {
    if (id === 'logout') {
      await dispatch(authThunks.logout());
      navigate(Paths.Home);
      toast.success('Будем скучать!');
    }
    dispatch(uiActions.closeBurger());
  };

  const menuLinks = navigationList.map(({ id, title, to }) => (
    <MenuLink clickHandler={() => clickHandler(id)} key={id} title={title} to={to} />
  ));

  return (
    <nav className="menu-nav">
      <ul className="navigation-list">{menuLinks}</ul>
    </nav>
  );
};
