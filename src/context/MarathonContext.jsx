import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';
import ApiService from '../services/api';
import { useAuth } from './AuthContext';

const MarathonContext = createContext();

export const useMarathon = () => {
  const context = useContext(MarathonContext);
  if (!context) {
    throw new Error('useMarathon must be used within a MarathonProvider');
  }
  return context;
};

export const MarathonProvider = ({ children }) => {
  const [marathons, setMarathons] = useState([]);
  const [userMarathons, setUserMarathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marathonCount, setMarathonCount] = useState(0);
  const { currentUser } = useAuth();

  // Fetch all marathons (requires authentication)
  const fetchMarathons = async (sort = 'newest', location = '') => {
    if (!currentUser) {
      setMarathons([]);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching all marathons with params:', { sort, location });
      const data = await ApiService.getMarathons(sort, location);
      console.log('Fetched marathons:', data);
      setMarathons(data || []);
    } catch (error) {
      console.error('Error fetching marathons:', error);
      setMarathons([]);
      toast({
        title: "Error",
        description: "Failed to load marathons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's marathons
  const fetchUserMarathons = async () => {
    if (!currentUser) {
      setUserMarathons([]);
      setMarathonCount(0);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching marathons for user:', currentUser.email);
      const data = await ApiService.getMarathons();
      console.log('All marathons from API:', data);
      
      // Filter user's marathons by email
      const userMarathons = data.filter(marathon => marathon.email === currentUser.email);
      console.log('User marathons:', userMarathons);
      
      setUserMarathons(userMarathons);
      setMarathonCount(userMarathons.length);
    } catch (error) {
      console.error('Error fetching user marathons:', error);
      setUserMarathons([]);
      setMarathonCount(0);
      toast({
        title: "Error",
        description: "Failed to load your marathons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new marathon
  const createMarathon = async (marathonData) => {
    try {
      setLoading(true);
      
      console.log('Creating marathon with data:', marathonData);
      console.log('Current user:', currentUser);
      
      // Add user email to marathon data
      const marathonWithUser = {
        ...marathonData,
        email: currentUser.email
      };
      
      console.log('Sending to API:', marathonWithUser);
      
      const response = await ApiService.createMarathon(marathonWithUser);
      
      console.log('API response:', response);
      
      if (response && (response.insertedId || response.acknowledged)) {
        // Refresh data from server to get latest marathons
        await fetchMarathons();
        await fetchUserMarathons();
        
        toast({
          title: "Success",
          description: "Marathon created successfully!"
        });
        
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating marathon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create marathon",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete marathon
  const deleteMarathon = async (marathonId) => {
    try {
      setLoading(true);
      
      await ApiService.deleteMarathon(marathonId);
      
      // Update local state
      setMarathons(prev => prev.filter(m => m._id !== marathonId));
      setUserMarathons(prev => prev.filter(m => m._id !== marathonId));
      setMarathonCount(prev => prev - 1);
      
      toast({
        title: "Success",
        description: "Marathon deleted successfully!"
      });
    } catch (error) {
      console.error('Error deleting marathon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete marathon",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update marathon
  const updateMarathon = async (marathonId, marathonData) => {
    try {
      setLoading(true);
      
      console.log('Updating marathon:', marathonId, marathonData);
      
      const response = await ApiService.updateMarathon(marathonId, marathonData);
      
      console.log('Update response:', response);
      
      if (response && (response.modifiedCount > 0 || response.acknowledged)) {
        // Refresh data from server to get latest marathons
        await fetchMarathons();
        await fetchUserMarathons();
        
        toast({
          title: "Success",
          description: "Marathon updated successfully!"
        });
        
        return response;
      } else {
        throw new Error('No changes were made to the marathon');
      }
    } catch (error) {
      console.error('Error updating marathon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update marathon",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserMarathons();
    } else {
      setUserMarathons([]);
      setMarathonCount(0);
    }
  }, [currentUser]);

  // Load all marathons on mount
  useEffect(() => {
    fetchMarathons();
  }, []);

  const value = {
    marathons,
    userMarathons,
    loading,
    marathonCount,
    createMarathon,
    deleteMarathon,
    updateMarathon,
    fetchMarathons,
    fetchUserMarathons
  };

  return (
    <MarathonContext.Provider value={value}>
      {children}
    </MarathonContext.Provider>
  );
};