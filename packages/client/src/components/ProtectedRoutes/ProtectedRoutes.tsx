import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Paths } from '../../config/constants';
import { authSelectors, useAppSelector } from '../../store';

export const ProtectedRoutes: FC = () => {
  const auth = useAppSelector(authSelectors.isAuthenticated);
  const location = useLocation();

  if (!auth) {
    toast.success('Вам необходимо авторизоваться');
    return <Navigate to={Paths.SignIn} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
