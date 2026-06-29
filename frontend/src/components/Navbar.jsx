import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, PenSquare, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-indigo-600 gap-2">
              <Home className="w-6 h-6" />
              BlogSpace
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/create-post" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                  <PenSquare className="w-5 h-5 mr-1" />
                  Write
                </Link>
                <Link to="/profile" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                  <img src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : 'https://via.placeholder.com/40'} alt="Profile" className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-200" />
                  <span className="text-gray-500 hidden sm:inline">Hi, {user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
