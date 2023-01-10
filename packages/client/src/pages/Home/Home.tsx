import './Home.css';

import { FC } from 'react';

import promoImg from '/assets/img/tankettes_game.png';

import { Navigation } from '../../components/Navigation';

export const Home: FC = () => {
  return (
    <>
      <img src={promoImg} alt="Игра Танчики на Денди" className="promo-img" />
      <div className="menu">
        <div className="delimiter" />
        <nav data-testid="menu-nav-home" className="menu-nav">
          <ul className="navigation-list">
            <Navigation />
          </ul>
        </nav>
      </div>
    </>
  );
};
