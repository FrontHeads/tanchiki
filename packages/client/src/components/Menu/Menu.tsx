import './Menu.css';

import { FC, useEffect, useRef, useState } from 'react';

import { MenuLink } from '../MenuLink';
import { navigationList } from './MenuData';

export const Menu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
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
        console.log(menuRef.current);
      }
    };
    document.addEventListener('mousedown', handler);
  });

  return (
    <div data-testid="menu" className="menu" ref={menuRef}>
      <div data-testid="menu__icon" className="menu__icon" onClick={openMenu}>
        <div className="menu__icon-line"></div>
        <div className="menu__icon-line"></div>
        <div className="menu__icon-line"></div>
      </div>
      <div
        data-testid="menu__list"
        data-test={isOpen ? 'menu-list-on' : 'menu-list-off'}
        className={'menu__list ' + (isOpen ? '' : 'menu__list-hide')}>
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
