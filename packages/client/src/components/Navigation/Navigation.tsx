import './Navigation.css';

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { uiActions } from '../../store/features/ui/uiSlice';
import { MenuLink } from '../MenuLink';
import { NAVIGATION_LIST } from './data';

export const Navigation: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(authSelectors.error);

  const onClick = async (linkName: string) => {
    if (linkName === 'logout') {
      await dispatch(authThunks.logout());

      if (!error) {
        toast.success('Будем скучать!');
        return navigate(Paths.Home);
      } else {
        toast.error(error);
        dispatch(authActions.setError(''));
      }
    }

    dispatch(uiActions.closeBurgerMenu());
    //TODO убрать здесь scroll после реализации scrollRestoration
    window.scrollTo(0, 0);
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
