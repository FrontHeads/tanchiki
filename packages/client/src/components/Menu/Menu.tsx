import './Menu.css';

import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';

import { MenuLink } from '../MenuLink';
import { navigationList } from './MenuData';

export const Menu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const iconLineClassName = cn('menu__icon-line ', {
    'menu__icon-line_open': isOpen,
  });

  const menuListClassName = cn('menu__list ', {
    menu__list_hide: !isOpen,
  });

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
            {navigationList.map(({ id, title, to }) => (
              <MenuLink handleNavigate={closeMenu} key={id} title={title} to={to} />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
