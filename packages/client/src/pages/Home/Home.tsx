import './Home.css';

import { FC, useEffect } from 'react';

import promoImg from '../../assets/img/tankettes_game.png';
import { logoutItem, navigationList } from '../../components/Menu/MenuData';
import { MenuLink } from '../../components/MenuLink';
import { authThunks, useAppDispatch } from '../../store';
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

  const logoutHandler = () => {
    dispatch(authThunks.logout());
  };

  const menuLinks = navigationList.map(({ id, title, to }) => <MenuLink key={id} title={title} to={to} />);

  const logoutLink = (
    <MenuLink handleNavigate={logoutHandler} key={logoutItem.id} title={logoutItem.title} to={logoutItem.to} />
  );

  return (
    <>
      <img src={promoImg} alt="Игра Танчики на Денди" className="promo-img" />
      <div className="menu">
        <div className="delimiter" />
        <nav data-testid="menu-nav-home" className="menu-nav">
          <ul className="navigation-list">
            <>
              {menuLinks}
              {logoutLink}
            </>
          </ul>
        </nav>
      </div>
    </>
  );
};
