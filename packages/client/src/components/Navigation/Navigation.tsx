import './Navigation.css';

import { type FC, useCallback, useMemo } from 'react';
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

  const onClick = useCallback((linkName: string, e: React.MouseEvent) => {
    dispatch(uiActions.closeBurgerMenu());

    if (linkName === 'logout') {
      e.preventDefault();

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
  }, []);

  const menuLinksList = useMemo(
    () =>
      getFilteredNavigationList(isAuthenticated, exclude).map(link => (
        <MenuLink onClick={e => onClick(link.name, e)} key={link.name} {...link} />
      )),
    [isAuthenticated]
  );

  return (
    <nav className="menu-nav">
      <ul className="navigation-list">{menuLinksList}</ul>
    </nav>
  );
};
