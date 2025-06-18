import { use, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const HomeController = () => {
 const token = localStorage.getItem('token');

 const navigate = useNavigate();

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('role', data.user.role);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  fetchProfile();
}, []); // Empty dependency array to run only once on mount
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  else {
    if (localStorage.getItem('role') === 'customer') {
      return <Navigate to="/customer" replace />;
    }
    return <Navigate to="/admin" replace />;
  }
};

export default HomeController;