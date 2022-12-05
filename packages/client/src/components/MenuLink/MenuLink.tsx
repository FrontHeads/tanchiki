import './MenuLink.css';

import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import linkTank from '../../assets/img/link_tank.png';
import { MenuLinkProps } from './typings';

export const MenuLink: FC<MenuLinkProps> = ({ title, to, onClick }) => {
  return (
    <li data-testid="navigation-list__row" className="navigation-list__row">
      <NavLink onClick={onClick} className="menu__link" to={to}>
        {title}
      </NavLink>
      <span className="menu-link__tank-wrapper">
        <img src={linkTank} alt=">" className="menu-link__tank-img" />
      </span>
    </li>
  );
};
