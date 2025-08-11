import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog.jsx';
import { Calendar, MapPin, FileText, Image } from 'lucide-react';
import { useMarathon } from '../context/MarathonContext.jsx';
import { toast } from '../hooks/use-toast.js';

const EditMarathonModal = ({ marathon, isOpen, onClose }) => {
  const { updateMarathon, loading } = useMarathon();
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

  useEffect(() => {
    if (marathon) {
      setFormData({
        marathonTitle: marathon.marathonTitle || '',
        startRegistrationDate: marathon.startRegistrationDate || '',
        endRegistrationDate: marathon.endRegistrationDate || '',
        marathonStartDate: marathon.marathonStartDate || '',
        location: marathon.location || '',
        runningDistance: marathon.runningDistance || '',
        description: marathon.description || '',
        marathonImage: marathon.marathonImage || ''
      });
    }
  }, [marathon]);

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
    
    console.log('Updating marathon with data:', formData);
    
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

      console.log('Validation passed, updating marathon...');
      
      // Update marathon via API
      await updateMarathon(marathon._id, formData);
      
      console.log('Marathon updated successfully');
      
      // Close modal
      onClose();

    } catch (error) {
      console.error('Error updating marathon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update marathon. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Marathon</DialogTitle>
        </DialogHeader>
        
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
              <Select value={formData.runningDistance} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5k">5K</SelectItem>
                  <SelectItem value="10k">10K</SelectItem>
                  <SelectItem value="half">Half Marathon</SelectItem>
                  <SelectItem value="full">Full Marathon</SelectItem>
                </SelectContent>
              </Select>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your marathon event..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Marathon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMarathonModal;