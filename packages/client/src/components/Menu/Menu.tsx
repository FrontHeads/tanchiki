import './Menu.css';

import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';

import { authThunks, useAppDispatch } from '../../store';
import { MenuLink } from '../MenuLink';
import { logoutItem, navigationList } from './MenuData';

export const Menu: FC = () => {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const iconLineClassName = cn('menu__icon-line ', {
    'menu__icon-line_open': isOpen,
  });

  const menuListClassName = cn('menu__list ', {
    menu__list_hide: !isOpen,
  });

  const logoutHandler = () => {
    dispatch(authThunks.logout());
  };

  const toggleMenu = () => {
    setIsOpen(prevState => {
      return !prevState;
    });
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as HTMLElement)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  });

  const menuLinks = navigationList.map(({ id, title, to }) => (
    <MenuLink handleNavigate={closeMenu} key={id} title={title} to={to} />
  ));

  const logoutLink = (
    <MenuLink handleNavigate={logoutHandler} key={logoutItem.id} title={logoutItem.title} to={logoutItem.to} />
  );

  return (
    <div data-testid="menu" className="menu" ref={menuRef}>
      <div data-testid="menu__icon" className="menu__icon" onClick={toggleMenu}>
        <div className={iconLineClassName}></div>
        <div className={iconLineClassName}></div>
        <div className={iconLineClassName}></div>
      </div>
      <div data-testid="menu__list" data-test={isOpen ? 'menu-list-on' : 'menu-list-off'} className={menuListClassName}>
        <nav className="menu-nav">
          <ul className="navigation-list">
            <>
              {menuLinks}
              {logoutLink}
            </>
          </ul>
        </nav>
      </div>
    </div>
  );
};
