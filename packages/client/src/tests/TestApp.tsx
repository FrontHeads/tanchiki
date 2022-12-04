import { FC } from 'react';
import { Provider } from 'react-redux';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import { Root } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';
import { store } from '../store';

const About: FC = () => <div>Вы на странице "О нас"</div>;
const Home: FC = () => <div>Вы на домашней странице</div>;
const Game: FC = () => <div>Игра</div>;
const NotAGame: FC = () => <div>Не игра</div>;

export const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
};

export const TestApp: FC = () => (
  <Provider store={store}>
    <div>
      <Link to="/">Главная</Link>
      <Link to="/about">О нас</Link>
      <Link to="/game">Game</Link>
      <Link to="/not-game">Not game</Link>
      <Link to="/fake-path">Fake path</Link>

      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/game" element={<Game />} />
          <Route path="/not-game" element={<NotAGame />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <LocationDisplay />
    </div>
  </Provider>
);
