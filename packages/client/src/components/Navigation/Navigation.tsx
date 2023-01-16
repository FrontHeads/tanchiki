import './Navigation.css';

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authActions, authThunks, useAppDispatch } from '../../store';
import { uiActions } from '../../store/features/ui/uiSlice';
import { MenuLink } from '../MenuLink';
import { NAVIGATION_LIST } from './data';

export const Navigation: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClick = (linkName: string) => {
    if (linkName === 'logout') {
      dispatch(authThunks.logout())
        .unwrap()
        .then(() => {
          navigate(Paths.Home);
          window.location.reload();
        })
        .catch(e => {
          toast.error(e.message);
          dispatch(authActions.setError(''));
        });
    }

    dispatch(uiActions.closeBurgerMenu());
  };

  const menuLinksList = NAVIGATION_LIST.map(link => (
    <MenuLink onClick={() => onClick(link.name)} key={link.name} {...link} />
  ));

  return (
    <nav className="menu-nav">
      <ul className="navigation-list">{menuLinksList}</ul>
    </nav>
  );
};
