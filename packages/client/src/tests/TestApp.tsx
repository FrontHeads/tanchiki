import { Link, Route, Routes, useLocation } from 'react-router-dom';

import { Root } from '../layouts/Root';
import { ErrorPage } from '../pages/ErrorPage';

const About: React.FC = () => <div>Вы на странице "О нас"</div>;
const Home: React.FC = () => <div>Вы на домашней странице</div>;

export const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
};

export const TestApp: React.FC = () => (
  <div>
    <Link to="/">Главная</Link>
    <Link to="/about">О нас</Link>
    <Link to="/game">Game</Link>
    <Link to="/not-game">Not game</Link>
    <Link to="/fake-path">Fake path</Link>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/game" element={<Root />} />
      <Route path="/not-game" element={<Root />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>

    <LocationDisplay />
  </div>
);
