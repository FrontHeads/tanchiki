import './Home.css';

import { useEffect } from 'react';

import { appActions, useAppDispatch } from '../../store';
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


  // This is how the dispatch works
  const dispatch = useAppDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(appActions.setIsLoading(true));
      setTimeout(() => {
        dispatch(appActions.setIsLoading(false));
      }, 2000);
    }, 2000);
  }, []);

  return (
    <div className="app">
      <div className="text-center">Вот тут будет жить ваше приложение :)</div>
    </div>
  );
};
