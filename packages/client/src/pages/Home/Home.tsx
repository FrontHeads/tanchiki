import './Home.css';

import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    };

    fetchServerData();
  }, []);
  return (
    <div className="app">
      <div className="text-center">Вот тут будет жить ваше приложение :)</div>
    </div>
  );
};

export default Home;
