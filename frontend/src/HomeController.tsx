import { Navigate } from 'react-router-dom';

const HomeController = () => {
 const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  else {
    return <Navigate to="/admin" replace />;
  }
};

export default HomeController;