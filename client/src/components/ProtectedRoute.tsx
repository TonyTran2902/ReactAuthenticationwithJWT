import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthContext } from '../context/AuthProvider';
import { FullScreenLoader } from './FullScreenLoader';

export const ProtectedRoute = () => {
  const { status } = useAuthContext();
  const location = useLocation();

  if (status === 'loading') {
    return <FullScreenLoader message="Checking your session..." />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
