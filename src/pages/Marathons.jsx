import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarathon } from '../context/MarathonContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { MapPin, Calendar, Users, Search, Eye } from 'lucide-react';

const Marathons = () => {
  const { marathons, fetchMarathons, loading } = useMarathon();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchMarathons();
    }
  }, [currentUser]);

  const filteredMarathons = marathons.filter(marathon => {
    const matchesSearch = marathon.marathonTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         marathon.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === '' || marathon.location === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  const sortedMarathons = filteredMarathons.sort((a, b) => {
    return new Date(a.marathonStartDate) - new Date(b.marathonStartDate);
  });

  const uniqueLocations = [...new Set(marathons.map(marathon => marathon.location))];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRegistrationStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { label: 'Upcoming', color: 'bg-blue-500' };
    } else if (now >= start && now <= end) {
      return { label: 'Open', color: 'bg-green-500' };
    } else {
      return { label: 'Closed', color: 'bg-gray-500' };
    }
  };

  // Show login prompt for non-authenticated users
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Login Required</CardTitle>
            <CardDescription>
              Only logged-in users can view the marathons section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 text-gray-400 mx-auto" />
              <p className="text-gray-600">
                Please log in to your account to browse and register for marathon events.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center flex flex-col items-center justify-center min-h-[400px]">
          <span className="loading loading-dots loading-lg text-blue-600 mb-4"></span>
          <p className="text-gray-600">Loading marathons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Marathons</h1>
        <p className="text-gray-600 mt-2">Discover and apply for marathon events</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6 dark:bg-gray-900 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search marathons by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Marathons Grid */}
      {sortedMarathons.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-500">
              {searchTerm || selectedLocation ? (
                <p>No marathons found matching your criteria</p>
              ) : (
                <div>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No marathons available</p>
                  <p>Check back later for new marathon events!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMarathons.map((marathon) => {
            const registrationStatus = getRegistrationStatus(
              marathon.startRegistrationDate,
              marathon.endRegistrationDate
            );

            return (
              <Card key={marathon._id} className="hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 text-gray-900 dark:text-white">{marathon.marathonTitle}</CardTitle>
                      <CardDescription className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        {marathon.location}
                      </CardDescription>
                    </div>
                    <span className={`${registrationStatus.color} text-white text-xs px-2 py-1 rounded`}>
                      {registrationStatus.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marathon.marathonImage && (
                    <img
                      src={marathon.marathonImage}
                      alt={marathon.marathonTitle}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Registration: {formatDate(marathon.startRegistrationDate)} - {formatDate(marathon.endRegistrationDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Marathon Date: {formatDate(marathon.marathonStartDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Distance: {marathon.runningDistance?.toUpperCase()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{marathon.description}</p>

                  <div className="pt-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate(`/marathon/${marathon._id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      See Details
                    </Button>
                    {registrationStatus.label === 'Closed' && (
                      <p className="text-xs text-red-600 mt-2 text-center">Registration Closed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marathons;