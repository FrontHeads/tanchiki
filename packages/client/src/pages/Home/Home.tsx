import './Home.css';

import { useEffect } from 'react';

import { request } from '../../utils/request';

export const Home = () => {
  useEffect(() => {
    const fetchServerData = async () => {
      const data = await request.get<Record<string, unknown>>('/', {
        baseUrl: `http://localhost:${__SERVER_PORT__}`,
      });
      console.log(data.data);
    };

    fetchServerData();
  }, []);

  return (
    <div className="app">
      <div className="text-center">Вот тут будет жить ваше приложение :)</div>
    </div>
  );
};
