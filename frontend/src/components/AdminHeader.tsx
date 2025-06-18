import { useEffect, useState } from 'react';
import { Link,  useLocation } from 'react-router-dom'

const AdminHeader = () => {
  const location = useLocation()
  const path = location.pathname
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Optionally redirect to login page:
    window.location.href = '/';
    window.location.reload();
  };

  const isAuthenticated = !!localStorage.getItem('token');


  const navItems = [
    { name: 'Home', path: '/admin/login' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
  ]

  if(!path.includes('admin')) {
    return (
      <></>
    ); // Don't show header on login or register pages
  }
  return (
    <header className="bg-blue-700 text-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <nav className="space-x-4">
        {isAuthenticated && navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`hover:underline ${
              location.pathname === item.path ? 'font-semibold underline' : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
        {!isAuthenticated && (
          <Link
            to="/admin/login"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded cursor-pointer text-white font-semibold"
          >
            Login
          </Link>
        )}
        {!isAuthenticated && (
          <Link
            to="/admin/register"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded cursor-pointer text-white font-semibold"
          >
            Register
          </Link>
        )}
        {isAuthenticated && 
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded cursor-pointer text-white font-semibold"
          >
            Logout
          </button>
        }
        
      </nav>

      {/* Optional Logout */}
      {/* <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
        Logout
      </button> */}
    </header>
  )
}

export default AdminHeader
