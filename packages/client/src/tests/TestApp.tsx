import { Link, Route, Routes, useLocation } from 'react-router-dom';

import { Root } from '../layouts/Root';

const About: React.FC = () => <div>Вы на странице "О нас"</div>;
const Home: React.FC = () => <div>Вы на домашней странице</div>;
const NoMatch: React.FC = () => <div>Не найдено</div>;

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

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/game" element={<Root />} />
      <Route path="/not-game" element={<Root />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>

    <LocationDisplay />
  </div>
);
