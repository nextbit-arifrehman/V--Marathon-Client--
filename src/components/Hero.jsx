
import React from 'react';
import { Button } from './ui/button.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join Amazing <span className="text-yellow-300">Marathons</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover, register, and participate in marathons around the world. 
            Challenge yourself and achieve your running goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              // Show different CTAs for logged-in users
              <>
                <Button 
                  onClick={() => navigate('/marathons')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Browse Marathons
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  My Dashboard
                </Button>
              </>
            ) : (
              // Show auth CTAs for non-logged-in users
              <>
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
          
          {!currentUser && (
            <p className="mt-4 text-blue-100">
              Join thousands of runners worldwide
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

const Hero = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleViewChallengeClick = () => {
    if (currentUser) {
      navigate('/marathons');
    } else {
      navigate('/login');
    }
  };

  const handleJoinCommunityClick = () => {
    console.log('Join Community button clicked', { currentUser, hasCurrentUser: !!currentUser });
    if (currentUser) {
      console.log('Navigating to /about');
      navigate('/about');
    } else {
      console.log('Navigating to /register');
      navigate('/register');
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Marathon Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover, register, and participate in marathons around the world
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleViewChallengeClick}
            >
              View Challenge
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-blue-600"
              onClick={handleJoinCommunityClick}
            >
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
