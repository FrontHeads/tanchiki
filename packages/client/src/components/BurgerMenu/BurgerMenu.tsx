import './BurgerMenu.css';

import cn from 'classnames';
import { FC, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../store';
import { uiActions, uiSelectors } from '../../store/features/ui/ui-slice';
import { Navigation } from '../Navigation';

export const BurgerMenu: FC = () => {
  const dispatch = useAppDispatch();
  const { isBurgerVisible } = useAppSelector(uiSelectors.all);
  const menuRef = useRef<HTMLDivElement>(null);

  const iconLineClassName = cn('menu__button-line ', {
    'menu__button-line_open': isBurgerVisible,
  });

  const menuListClassName = cn('menu__list ', {
    menu__list_hide: !isBurgerVisible,
  });

  const toggleHandler = () => {
    dispatch(uiActions.toggleBurger());
  };

  const closeHandler = () => {
    dispatch(uiActions.closeBurger());
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as HTMLElement)) {
        closeHandler();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  });

  return (
    <div data-testid="menu" className="menu" ref={menuRef}>
      <button data-testid="menu__button" className="menu__button" onClick={toggleHandler}>
        <div className={iconLineClassName}></div>
        <div className={iconLineClassName}></div>
        <div className={iconLineClassName}></div>
      </button>
      <div
        data-testid="menu__list"
        data-test={isBurgerVisible ? 'menu-list-on' : 'menu-list-off'}
        className={menuListClassName}>
        <Navigation />
      </div>
    </div>
  );
};
