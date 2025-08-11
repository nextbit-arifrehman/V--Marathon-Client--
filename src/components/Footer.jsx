
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { currentUser } = useAuth();
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">MarathonHub</h3>
            <p className="text-gray-300 dark:text-gray-400 mb-4">
              Your premier destination for marathon events. Connect with runners, discover amazing races, 
              and achieve your fitness goals with our comprehensive marathon management platform.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {!currentUser && (
                <li>
                  <Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                    Home
                  </Link>
                </li>
              )}
              <li>
                <Link to="/marathons" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Marathons
                </Link>
              </li>
              {!currentUser && (
                <li>
                  <Link to="/about" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                    About
                  </Link>
                </li>
              )}
              {currentUser ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/add-marathon" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                      Add Marathon
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/my-marathons" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                      My Marathons
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 dark:border-gray-800">
          <p className="text-center text-gray-300 dark:text-gray-400">
            © 2024 MarathonHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
