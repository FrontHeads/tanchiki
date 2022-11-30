import './Home.css';

import { useEffect } from 'react';

import { appActions, useAppDispatch } from '../../store';
import { HTTP } from '../../utils/Http';

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

  // This is how the dispatch works. Remove later
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(appActions.setIsLoading(true));
    setTimeout(() => {
      dispatch(appActions.setIsLoading(false));
    }, 2000);
  }, []);

  return (
    <div className="app">
      <div className="text-center">Вот тут будет жить ваше приложение :)</div>
    </div>
  );
};
