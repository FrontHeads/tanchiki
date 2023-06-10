import './BurgerMenu.css';

import cn from 'classnames';
import { type FC, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../store';
import { uiActions, uiSelectors } from '../../store/features/ui/uiSlice';
import { Navigation } from '../Navigation';
import { ThemeToggle } from '../ThemeToggle';

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeHandler();
      }
    };
    if (isBurgerMenuVisible) {
      document.addEventListener('mousedown', handler);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBurgerMenuVisible]);

  return (
    <div data-testid="menu" className="menu" ref={menuRef}>
      <button
        data-testid="menu__button"
        className="menu__button"
        onClick={toggleHandler}
        aria-expanded={isBurgerMenuVisible}
        aria-controls="menu__list"
        aria-label="Кнопка открытия или закрытия основного меню">
        <div className={iconLineClassName}></div>
        <div className={iconLineClassName}></div>
        <div className={iconLineClassName}></div>
      </button>
      <div
        data-testid="menu__list"
        id="menu__list"
        data-test={isBurgerMenuVisible ? 'menu-list-on' : 'menu-list-off'}
        className={menuListClassName}>
        <ThemeToggle />
        <Navigation />
      </div>
    </div>
  );
};
