import './ErrorPage.css';

import { Link, useRouteError } from 'react-router-dom';

type ErrorType = { status?: number; statusText?: string; message?: string };

export const ErrorPage: React.FC = () => {
  const error = useRouteError() as ErrorType;

  return (
    <div className="error-page">
      <h1>Ошибка {error.status}!</h1>
      <p>{error.statusText || error.message}</p>
      <Link to={'/'}>На главную</Link>
    </div>
  );
};
