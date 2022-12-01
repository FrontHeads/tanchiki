import './Home.css';

import { useEffect } from 'react';

import promoImg from '../../assets/img/tankettes_game.png';
import { navigationList } from '../../components/Menu/MenuData';
import { MenuLink } from '../../components/MenuLink';
import { HTTP } from '../../utils/HTTP';

export const Home = () => {
  useEffect(() => {
    const fetchServerData = async () => {
      const data = await HTTP.get<Record<string, unknown>>('/', {
        baseUrl: `http://localhost:${__SERVER_PORT__}`,
      });
      console.log(data.data);
    };

    fetchServerData();
  }, []);

  return (
    <div className="menu">
      <img src={promoImg} alt="Игра Танчики на Денди" className="promo-img" />
      <div className="delimiter" />
      <nav role="nav" data-testid="nav" className="menu-nav">
        <ul role="nav-list" className="navigation-list">
          {navigationList.map(({ id, title, to }) => (
            <MenuLink key={id} title={title} to={to} />
          ))}
        </ul>
      </nav>
    </div>
  );
};
