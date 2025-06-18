import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

const CustomerHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const cartItemCount = localStorage.getItem('cartItems') ? 
    JSON.parse(localStorage.getItem('cartItems')!).length : 0;
  
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    navigate('/login');
  };

  if(path.includes('admin')) {
      return null; // Hide header for admin routes
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Store
            </Link>
            <div className="hidden md:flex items-center ml-10 space-x-8">
              {localStorage.getItem('token') && 
              <Link to="/customer/products" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {localStorage.getItem('token') &&
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            }

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">

                <Link to="/profile">
                  <UserIcon className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default CustomerHeader;