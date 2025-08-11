// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { toast } from '../hooks/use-toast';
// import ApiService from '../services/api';
// import { useAuth } from './AuthContext';

// const ApplicationContext = createContext();

// export const useApplication = () => {
//   const context = useContext(ApplicationContext);
//   if (!context) {
//     throw new Error('useApplication must be used within an ApplicationProvider');
//   }
//   return context;
// };

// export const ApplicationProvider = ({ children }) => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { currentUser } = useAuth();

//   // Fetch user's applications
//   const fetchMyApplications = async (search = '') => {
//     if (!currentUser) {
//       console.log('No current user, skipping application fetch');
//       setApplications([]);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       console.log('ApplicationContext: Fetching applications for user:', currentUser.email);
//       const data = await ApiService.getMyApplications(search);
//       console.log('ApplicationContext: Applications received:', data);
//       setApplications(data || []);
//     } catch (error) {
//       console.error('ApplicationContext: Error fetching applications:', error);
//       // Don't show toast for authentication errors in development
//       if (!error.message?.includes('HTTP error! status: 401')) {
//         toast({
//           title: "Error",
//           description: "Failed to load your applications",
//           variant: "destructive"
//         });
//       }
//       setApplications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Apply for marathon
//   const applyForMarathon = async (applicationData) => {
//     try {
//       setLoading(true);
      
//       const response = await ApiService.applyForMarathon(applicationData);
      
//       if (response.insertedId) {
//         const newApplication = { _id: response.insertedId, ...applicationData };
//         setApplications(prev => [newApplication, ...prev]);
        
//         toast({
//           title: "Success",
//           description: "Successfully applied for marathon!"
//         });
        
//         return newApplication;
//       }
//     } catch (error) {
//       console.error('Error applying for marathon:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to apply for marathon",
//         variant: "destructive"
//       });
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update application
//   const updateApplication = async (applicationId, applicationData) => {
//     try {
//       setLoading(true);
      
//       const response = await ApiService.updateApplication(applicationId, applicationData);
      
//       if (response.modifiedCount > 0) {
//         setApplications(prev => prev.map(app => 
//           app._id === applicationId ? { ...app, ...applicationData } : app
//         ));
        
//         toast({
//           title: "Success",
//           description: "Application updated successfully!"
//         });
//       }
//     } catch (error) {
//       console.error('Error updating application:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update application",
//         variant: "destructive"
//       });
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete application
//   const deleteApplication = async (applicationId) => {
//     try {
//       setLoading(true);
      
//       await ApiService.deleteApplication(applicationId);
      
//       setApplications(prev => prev.filter(app => app._id !== applicationId));
      
//       toast({
//         title: "Success",
//         description: "Application deleted successfully!"
//       });
//     } catch (error) {
//       console.error('Error deleting application:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete application",
//         variant: "destructive"
//       });
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load applications when user changes
//   useEffect(() => {
//     if (currentUser) {
//       fetchMyApplications();
//     } else {
//       setApplications([]);
//     }
//   }, [currentUser]);

//   const value = {
//     applications,
//     loading,
//     applyForMarathon,
//     updateApplication,
//     deleteApplication,
//     fetchMyApplications
//   };

//   return (
//     <ApplicationContext.Provider value={value}>
//       {children}
//     </ApplicationContext.Provider>
//   );
// };