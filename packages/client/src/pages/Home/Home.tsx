import './Home.css';

import { type FC } from 'react';

import promoImg from '/assets/img/tankettes_game.png';

import { Navigation } from '../../components/Navigation';
import { generateMetaTags } from '../../utils/seoUtils';

export const Home: FC = () => {
  return (
    <>
      {generateMetaTags({ title: 'Главная' })}
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
