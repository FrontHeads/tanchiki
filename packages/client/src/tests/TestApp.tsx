import { Link, Route, Routes, useLocation } from 'react-router-dom';

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

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>

    <LocationDisplay />
  </div>
);
