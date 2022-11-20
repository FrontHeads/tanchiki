import './App.css';

import { useEffect } from 'react';

import Hello from './components/Hello';

function App() {
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
      <Hello topic="FrontHeads" />
    </div>
  );
}

export default App;
