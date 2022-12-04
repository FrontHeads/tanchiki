import './BurgerMenu.css';

import cn from 'classnames';
import { FC, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../store';
import { uiActions, uiSelectors } from '../../store/features/ui/ui-slice';
import { Navigation } from '../Navigation';

export const BurgerMenu: FC = () => {
  const dispatch = useAppDispatch();
  const { isBurgerMenuVisible } = useAppSelector(uiSelectors.all);
  const menuRef = useRef<HTMLDivElement>(null);

  const iconLineClassName = cn('menu__button-line ', {
    'menu__button-line_open': isBurgerMenuVisible,
  });

  const menuListClassName = cn('menu__list ', {
    menu__list_hide: !isBurgerMenuVisible,
  });

  const toggleHandler = () => {
    dispatch(uiActions.toggleBurgerMenu());
  };

  const closeHandler = () => {
    dispatch(uiActions.closeBurgerMenu());
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
        data-test={isBurgerMenuVisible ? 'menu-list-on' : 'menu-list-off'}
        className={menuListClassName}>
        <Navigation />
      </div>
    </div>
  );
};
