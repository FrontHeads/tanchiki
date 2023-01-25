import './Navigation.css';

import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { uiActions } from '../../store/features/ui/uiSlice';
import { getFilteredNavigationList } from '../../utils/navigationUtils';
import { MenuLink } from '../MenuLink';
import { type NavigationProps } from './typings';

export const Navigation: FC<NavigationProps> = ({ exclude }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(authSelectors.isAuthenticated);

  const onClick = (linkName: string) => {
    if (linkName === 'logout') {
      dispatch(authThunks.logout())
        .unwrap()
        .then(() => {
          toast.success('Будем скучать!');
          return navigate(Paths.Home);
        })
        .catch(e => {
          toast.error(e.message);
          dispatch(authActions.setError(''));
        });
    }

    dispatch(uiActions.closeBurgerMenu());
  };

  /**
   * Фильтруем пункты меню в зависимости от того - достуен ли
   * раздел авторизованному пользователю/гостю
   */
  const menuLinksList = getFilteredNavigationList(isAuthenticated, exclude).map(link => (
    <MenuLink onClick={() => onClick(link.name)} key={link.name} {...link} />
  ));

  return (
    <nav className="menu-nav">
      <ul className="navigation-list">{menuLinksList}</ul>
    </nav>
  );
};
