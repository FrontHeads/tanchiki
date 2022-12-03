import './Home.css';

import { FC, useEffect } from 'react';
import { toast } from 'react-toastify';

import promoImg from '../../assets/img/tankettes_game.png';
import { Navigation } from '../../components/Navigation';
import { useAppDispatch } from '../../store';
import { HTTP } from '../../utils/HTTP';

export const Home: FC = () => {
  const dispatch = useAppDispatch();

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
            <Navigation />
          </ul>
        </nav>
      </div>
    </>
  );
};
