
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Home, ArrowLeft, MapPin, Calendar, Trophy } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle.js';

const NotFound = () => {
  const navigate = useNavigate();
  usePageTitle('Page Not Found - Marathon Hub');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="text-center shadow-2xl border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-16">
            {/* Marathon-themed 404 Visual */}
            <div className="relative mb-8">
              <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">
                404
              </div>
              <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <Trophy className="h-8 w-8 md:h-12 md:w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Marathon-themed Message */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! You've Taken a Wrong Turn
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                It looks like you've wandered off the marathon route! The page you're looking for doesn't exist or has been moved to a different track.
              </p>
            </div>

            {/* Marathon-themed Icons Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Find Route</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Events</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <Trophy className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Marathons</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link to="/" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 w-full sm:w-auto text-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Back to Marathon Hub
                </Button>
              </Link>

             
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Looking for something specific? Try these popular sections:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/marathons">
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    Browse Marathons
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    About Us
                  </Button>
                </Link>
                <Link to="/login">
         
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
