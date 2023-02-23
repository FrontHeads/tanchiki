import './MenuLink.css';

import { type FC } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import linkTank from '/assets/img/link_tank.png';

import { type MenuLinkProps } from './typings';

export const MenuLink: FC<MenuLinkProps> = ({ title, to, disabled, onClick }) => {
  const disabledClassName = disabled ? 'menu-link__item_disabled' : '';
  const disabledTitle = disabled ? 'В демо-версии приложения этот функционал недоступен' : '';
  if (disabled) {
    to = '#';
  }

  return (
    <li data-testid="navigation-list__row" className="navigation-list__row" title={disabledTitle}>
      <NavLink onClick={onClick} className={cn('menu-link__item', disabledClassName)} to={to}>
        {title}
      </NavLink>
      <span className="menu-link__tank-wrapper">
        <img src={linkTank} alt=">" className={cn('menu-link__tank-img', disabledClassName)} width="40px" />
      </span>
    </li>
  );
};
