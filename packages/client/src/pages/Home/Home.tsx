import './Home.css';

import { useEffect } from 'react';

import { Http } from '../../utils/Http';

export const Home = () => {
  useEffect(() => {
    const fetchServerData = async () => {
      const data = await Http.get<Record<string, unknown>>('/', {
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
