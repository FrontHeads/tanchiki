import './Navigation.css';

import { type FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { uiActions } from '../../store/features/ui/uiSlice';
import { getFilteredNavigationList } from '../../utils/navigationUtils';
import { MenuLink } from '../MenuLink';
import { type MenuLinkProps } from '../MenuLink/typings';
import { type NavigationProps } from './typings';

export const Navigation: FC<NavigationProps> = ({ exclude }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(authSelectors.isAuthenticated);

  const disabledNote = 'В демо-версии приложения этот функционал недоступен';

  const onClick = useCallback((link: MenuLinkProps, e: React.MouseEvent) => {
    dispatch(uiActions.closeBurgerMenu());

    if (link.name === 'logout') {
      /**
       * 1. Предотвращаем стандартный редирект на главную
       * 2. Затем в logout указываем параметр false, который сообщает в thunk,
       *    что не нужно обнулять userProfile в store. Если этого не сделать, то
       *    обнуление userProfile произойдет до выхода из текущего роута (до
       *    редиректа на главную) и если этот роут protected, то помимо сообщения
       *    "будем скучать" будет еще сообщение "вам необходимо авторизоваться" и
       *    лишний редирект на главную. Каждый редирект на главную провоцирует
       *    запуск запроса из loader, что влечет за собой нестабильную работу
       *    приложения
       * 3. При успешном логауте делаем редирект на главную и затем уже обнуляем
       *    профиль пользователя
       */
      e.preventDefault();

      dispatch(authThunks.logout(false))
        .unwrap()
        .then(() => {
          toast.success('Будем скучать!');
          navigate(Paths.Home);
          return dispatch(authActions.setUserProfile(null));
        })
        .catch(e => {
          toast.error(e.message);
          dispatch(authActions.setError(''));
        });
    }

    if (link.disabled) {
      toast.error(disabledNote);
      e.preventDefault();
    }
  }, []);

  const menuLinksList = useMemo(
    () =>
      getFilteredNavigationList(isAuthenticated, exclude).map(link => (
        <MenuLink onClick={e => onClick(link, e)} key={link.name} {...link} disabledNote={disabledNote} />
      )),
    [isAuthenticated]
  );

  return (
    <nav role="navigation" className="menu-nav" aria-label="Основное меню сайта">
      <ul role="menu" className="navigation-list">
        {menuLinksList}
      </ul>
    </nav>
  );
};
