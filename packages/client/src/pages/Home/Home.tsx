import './Home.css';

import { useEffect } from 'react';

import { Tanchiki } from '../../game';

export const Home = () => {
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    };

    fetchServerData();

    const game = new Tanchiki(document.querySelector('#tanchiki-game'));
    game.init();
  }, []);

  return (
    <div className="app">
      <div className="text-center">Вот тут будет жить ваше приложение :)</div>
      <div id="tanchiki-game" style={{ margin: '10px 0', border: '10px solid grey' }}></div>
    </div>
  );
};
