import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarathon } from '../context/MarathonContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';
import { Calendar, MapPin, Timer, FileText, Image } from 'lucide-react';

const AddMarathon = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createMarathon, loading } = useMarathon();
  const [formData, setFormData] = useState({
    marathonTitle: '',
    startRegistrationDate: '',
    endRegistrationDate: '',
    marathonStartDate: '',
    location: '',
    runningDistance: '',
    description: '',
    marathonImage: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      runningDistance: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a marathon",
        variant: "destructive"
      });
      return;
    }

    console.log('Form submission started...', formData);
    
    // Validate required fields
    if (!formData.marathonTitle || !formData.location || !formData.startRegistrationDate || 
        !formData.endRegistrationDate || !formData.marathonStartDate || !formData.runningDistance) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate dates
      const startReg = new Date(formData.startRegistrationDate);
      const endReg = new Date(formData.endRegistrationDate);
      const marathonStart = new Date(formData.marathonStartDate);

      if (endReg <= startReg) {
        toast({
          title: "Invalid Dates",
          description: "End registration date must be after start registration date.",
          variant: "destructive"
        });
        return;
      }

      if (marathonStart <= endReg) {
        toast({
          title: "Invalid Dates",
          description: "Marathon start date must be after registration end date.",
          variant: "destructive"
        });
        return;
      }

      console.log('Validation passed, creating marathon...');
      
      // Create marathon via API
      const result = await createMarathon(formData);
      
      console.log('Marathon created successfully:', result);
      
      // Reset form
      setFormData({
        marathonTitle: '',
        startRegistrationDate: '',
        endRegistrationDate: '',
        marathonStartDate: '',
        location: '',
        runningDistance: '',
        description: '',
        marathonImage: ''
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create marathon. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Marathon</h1>
        <p className="text-gray-600 mt-2">Create a new marathon event for runners to participate in.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marathon Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your marathon event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="marathonTitle">Marathon Title *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="marathonTitle"
                    name="marathonTitle"
                    value={formData.marathonTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., City Marathon 2024"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, NY"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startRegistrationDate">Start Registration Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="startRegistrationDate"
                    name="startRegistrationDate"
                    type="date"
                    value={formData.startRegistrationDate}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endRegistrationDate">End Registration Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="endRegistrationDate"
                    name="endRegistrationDate"
                    type="date"
                    value={formData.endRegistrationDate}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marathonStartDate">Marathon Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="marathonStartDate"
                    name="marathonStartDate"
                    type="date"
                    value={formData.marathonStartDate}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="runningDistance">Running Distance *</Label>
                <div className="relative">
                  <Timer className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select value={formData.runningDistance} onValueChange={handleSelectChange} required>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3k">3K</SelectItem>
                      <SelectItem value="10k">10K</SelectItem>
                      <SelectItem value="25k">25K</SelectItem>
                      <SelectItem value="42k">42K (Full Marathon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marathonImage">Marathon Image URL</Label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="marathonImage"
                  name="marathonImage"
                  type="url"
                  value={formData.marathonImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/marathon-image.jpg"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your marathon event..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Marathon'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMarathon;