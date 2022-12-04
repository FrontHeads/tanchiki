import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Paths } from '../../config/constants';
import { authSelectors, useAppSelector } from '../../store';

export const PublicRoutes: FC = () => {
  const auth = useAppSelector(authSelectors.isAuthenticated);
  const location = useLocation();

  if (auth) {
    const to = location.state?.from?.pathname || Paths.Home;
    return <Navigate to={to} replace={true} />;
  }

  return <Outlet />;
};
