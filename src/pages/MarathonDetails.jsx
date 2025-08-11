import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarathon } from '../context/MarathonContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import CountdownTimer from '../components/CountdownTimer.jsx';
import { MapPin, Calendar, Users, Clock, Trophy, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { API_BASE_URL, API_HEADERS } from '../config/constants.js';

const MarathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { marathons, fetchMarathons } = useMarathon();
  const { toast } = useToast();

  const [marathon, setMarathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    additionalInfo: ''
  });

  usePageTitle(marathon ? marathon.marathonTitle : 'Marathon Details');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const foundMarathon = marathons.find((m) => m._id === id);
    if (foundMarathon) {
      setMarathon(foundMarathon);
      setLoading(false);
    } else {
      fetchMarathons().then(() => {
        const found = marathons.find((m) => m._id === id);
        if (found) setMarathon(found);
        setLoading(false);
      });
    }
  }, [id, marathons, currentUser, navigate, fetchMarathons]);

  const isRegistrationOpen = () => {
    if (!marathon) return false;
    const now = new Date();
    return now <= new Date(marathon.endRegistrationDate);
  };

  const isOwnMarathon = () => {
    return currentUser && marathon && currentUser.email === marathon.email;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!registrationData.firstName || !registrationData.lastName || !registrationData.contactNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/apply`, {
        method: 'POST',
        headers: API_HEADERS,
        credentials: 'include',
        body: JSON.stringify({
          marathonId: marathon._id,
          marathonTitle: marathon.marathonTitle,
          marathonStartDate: marathon.marathonStartDate,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          contactNumber: registrationData.contactNumber,
          additionalInfo: registrationData.additionalInfo,
          email: currentUser.email
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "You have successfully registered for the marathon.",
        });
        fetchMarathons();
        // Redirect to applications section
        navigate('/dashboard/my-applications');
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Failed to register for marathon",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for marathon. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!marathon) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Marathon Not Found</h1>
          <Button onClick={() => navigate('/marathons')}>Back to Marathons</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/marathons')}
            className="mb-4"
          >
            ← Back to Marathons
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {marathon.marathonTitle}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{marathon.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(marathon.marathonStartDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Marathon Image */}
            {marathon.marathonImage && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-0">
                  <img
                    src={marathon.marathonImage}
                    alt={marathon.marathonTitle}
                    className="w-full h-64 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Marathon Details */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Marathon Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Registration Period</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(marathon.startRegistrationDate)} - {formatDate(marathon.endRegistrationDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {marathon.runningDistance} Marathon
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Registrations</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {marathon.totalRegistration || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Marathon Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(marathon.marathonStartDate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {marathon.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Section */}
          <div className="space-y-6">
            {/* Countdown Timer */}
            <CountdownTimer 
              targetDate={marathon.marathonStartDate} 
              title="Marathon Starts In"
            />
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Registration</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {isRegistrationOpen() 
                    ? "Registration is currently open" 
                    : "Registration period has ended"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isOwnMarathon() ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Your Marathon</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You cannot register for your own marathon
                    </p>
                    <Button 
                      disabled
                      className="w-full"
                    >
                      Your Own Marathon
                    </Button>
                  </div>
                ) : !isRegistrationOpen() ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Registration Closed</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Registration ended on {formatDate(marathon.endRegistrationDate)}
                    </p>
                    <Button 
                      disabled
                      className="w-full"
                    >
                      Registration Closed
                    </Button>
                  </div>
                ) : !showRegistrationForm ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Ready to join this amazing marathon?
                      </p>
                      <Button 
                        onClick={() => setShowRegistrationForm(true)}
                        className="w-full"
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistration} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={registrationData.firstName}
                          onChange={(e) => setRegistrationData({
                            ...registrationData,
                            firstName: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={registrationData.lastName}
                          onChange={(e) => setRegistrationData({
                            ...registrationData,
                            lastName: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="contactNumber">Contact Number *</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        value={registrationData.contactNumber}
                        onChange={(e) => setRegistrationData({
                          ...registrationData,
                          contactNumber: e.target.value
                        })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        value={registrationData.additionalInfo}
                        onChange={(e) => setRegistrationData({
                          ...registrationData,
                          additionalInfo: e.target.value
                        })}
                        placeholder="Any additional information..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRegistrationForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Submit Registration
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarathonDetails;