import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;