
import React from 'react';
import Carousel from '../components/Carousel.jsx';
import FeaturedMarathons from '../components/FeaturedMarathons.jsx';
import UpcomingEvents from '../components/UpcomingEvents.jsx';
import Testimonials from '../components/Testimonials.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

const Home = () => {
  usePageTitle('Home');
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Carousel />
      <FeaturedMarathons />
      <UpcomingEvents />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default Home;
