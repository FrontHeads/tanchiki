import './Home.css';

import { FC, useEffect } from 'react';

import promoImg from '../../assets/img/tankettes_game.png';
import { navigationList } from '../../components/Menu/MenuData';
import { MenuLink } from '../../components/MenuLink';
import { HTTP } from '../../utils/HTTP';

export const Home: FC = () => {
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
    <>
      <img src={promoImg} alt="Игра Танчики на Денди" className="promo-img" />
      <div className="menu">
        <div className="delimiter" />
        <nav data-testid="menu-nav-home" className="menu-nav">
          <ul className="navigation-list">
            {navigationList.map(({ id, title, to }) => (
              <MenuLink key={id} title={title} to={to} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
