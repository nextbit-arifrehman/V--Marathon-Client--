
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const FeaturedMarathons = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [featuredMarathons, setFeaturedMarathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMarathons = async () => {
      try {
        console.log('Fetching featured marathons from public endpoint...');
        const response = await fetch('https://hollydemon.vercel.app/api/marathons/public/featured', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Featured marathons data:', data);
        setFeaturedMarathons(data.slice(0, 6)); // Limit to 6 marathons
      } catch (error) {
        console.error('Error fetching featured marathons:', error);
        // Fallback to regular public marathons endpoint
        try {
          console.log('Trying fallback public endpoint...');
          const fallbackResponse = await fetch('https://hollydemon.vercel.app/api/marathons/public', {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            }
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Fallback marathons data:', fallbackData);
            setFeaturedMarathons(fallbackData.slice(0, 6));
          } else {
            console.error('Fallback endpoint also failed:', fallbackResponse.status);
          }
        } catch (fallbackError) {
          console.error('Error fetching fallback marathons:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMarathons();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading marathons...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Marathons
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover the most popular marathons happening this season
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMarathons.map((marathon) => (
            <Card key={marathon._id} className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-700">
              <div className="h-48 bg-cover bg-center bg-gray-300 dark:bg-gray-600" 
                   style={{ 
                     backgroundImage: marathon.marathonImage ? `url(${marathon.marathonImage})` : 'url(https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400)'
                   }} />
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                  <span>{marathon.marathonTitle}</span>
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{marathon.location}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Marathon Date: {new Date(marathon.marathonStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Registration Ends: {new Date(marathon.endRegistrationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span>Distance: {marathon.runningDistance}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (currentUser) {
                      navigate(`/marathon/${marathon._id}`);
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  See Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMarathons;
