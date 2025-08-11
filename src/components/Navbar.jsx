import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button.jsx';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Import useLocation
  const [loading, setLoading] = useState(false); // State for loading spinner

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setLoading(true); // Set loading to true
    await logout();
    setIsOpen(false);
    navigate('/'); // Redirect to homepage after logout
    setLoading(false); // Set loading to false
  };

  // Function to check if a link should be active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-blue-600 dark:bg-blue-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
              <img
                src="/favicon.ico"
                alt="MarathonHub Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-2xl font-bold text-white">MarathonHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Common links */}
            <Link
              to="/"
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/marathons"
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Marathons
            </Link>
            {!currentUser && (
              <Link
                to="/about"
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            )}

            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/add-marathon"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Add Marathon
                </Link>
                <Link
                  to="/dashboard/my-marathons"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Marathons
                </Link>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-white hover:bg-blue-700 dark:hover:bg-gray-800"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                <div className="flex items-center space-x-2">
                  {currentUser.photoURL && (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  )}
                  <span className="text-sm text-white">{currentUser.displayName || currentUser.email}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-dots loading-sm text-white"></span>
                  ) : (
                    <span>Logout</span>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-white hover:bg-blue-700 dark:hover:bg-gray-800"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                <Link to="/login">
                  <Button
                    className="bg-white text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-sm text-blue-600"></span>
                    ) : (
                      <span>Login</span>
                    )}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="bg-white text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-sm text-blue-600"></span>
                    ) : (
                      <span>Register</span>
                    )}
                  </Button>
                </Link>

              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-white hover:bg-blue-700 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-700 dark:hover:bg-gray-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-blue-700 dark:bg-blue-900">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/marathons"
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Marathons
              </Link>
              {!currentUser && (
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              )}
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/add-marathon"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Add Marathon
                  </Link>
                  <Link
                    to="/dashboard/my-marathons"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    My Marathons
                  </Link>
                  <div className="px-3 py-2 text-sm text-blue-200">
                    {currentUser.displayName || currentUser.email}
                  </div>

                  <button
                    onClick={() => {
                      setLoading(true);
                      logout().finally(() => {
                        setLoading(false);
                        setIsOpen(false);
                      });
                    }}
                    className="w-full text-left text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-sm text-white"></span>
                    ) : (
                      <span>Logout</span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2 text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                    onClick={() => {
                      setLoading(true);
                      setIsOpen(false);
                      setTimeout(() => setLoading(false), 1000);
                    }}
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-sm text-white"></span>
                    ) : (
                      <span>Login</span>
                    )}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2 text-white hover:text-blue-200 hover:bg-blue-800 dark:hover:bg-gray-700"
                    onClick={() => {
                      setLoading(true);
                      setIsOpen(false);
                      setTimeout(() => setLoading(false), 1000);
                    }}
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-sm text-white"></span>
                    ) : (
                      <span>Register</span>
                    )}
                  </Link>

                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;