import './MenuLink.css';

import { type FC } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import linkTank from '/assets/img/link_tank.png';

import { type MenuLinkProps } from './typings';

export const MenuLink: FC<MenuLinkProps> = ({ title, to, disabled, disabledNote, onClick }) => {
  const disabledClassName = disabled ? 'menu-link__item_disabled' : '';

  return (
    <li data-testid="navigation-list__row" className="navigation-list__row" title={disabled ? disabledNote : ''}>
      <NavLink onClick={onClick} className={cn('menu-link__item', disabledClassName)} to={disabled ? '#' : to}>
        {title}
      </NavLink>
      <span className="menu-link__tank-wrapper">
        <img src={linkTank} alt=">" className={cn('menu-link__tank-img', disabledClassName)} width="40px" />
      </span>
    </li>
  );
};
