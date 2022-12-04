import './Navigation.css';

import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { uiActions } from '../../store/features/ui/ui-slice';
import { MenuLink } from '../MenuLink';
import { navigationList } from './data';

export const Navigation: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(authSelectors.error);

  const clickHandler = async (id: string | number) => {
    //TODO брать из Enum
    if (id === 'logout') {
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
    //TODO возможно убрать scroll здесь
    window.scrollTo(0, 0);
  };

  //TODO тут бы тип хорошо добавить для { id, title, to }
  const menuLinks = navigationList.map(({ id, title, to }) => (
    <MenuLink clickHandler={() => clickHandler(id)} key={id} title={title} to={to} />
  ));

  return (
    <nav className="menu-nav">
      <ul className="navigation-list">{menuLinks}</ul>
    </nav>
  );
};
