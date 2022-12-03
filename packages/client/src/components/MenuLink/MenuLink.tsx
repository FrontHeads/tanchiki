import './MenuLink.css';

import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import linkTank from '../../assets/img/link_tank.png';
import { MenuLinkProps } from './typings';

export const MenuLink: FC<MenuLinkProps> = ({ title, to, clickHandler }) => {
  return (
    <li data-testid="navigation-list__row" className="navigation-list__row">
      <NavLink onClick={clickHandler} className="menu__link" to={to}>
        {title}
      </NavLink>
      <span className="menu__tank-wrapper">
        <img src={linkTank} alt=">" className="menu__tank-img" />
      </span>
    </li>
  );
};
