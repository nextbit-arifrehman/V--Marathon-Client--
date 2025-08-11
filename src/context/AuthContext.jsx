
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from '../hooks/use-toast';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register function - you'll handle this with your preferred auth method
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Create user object (you can integrate with Firebase or custom auth here)
      const user = {
        email: userData.email,
        displayName: userData.name,
        photoURL: userData.photoURL || ''
      };
      
      // Create JWT token
      const response = await ApiService.createJWT(user.email);
      
      if (response.success) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

        toast({
          title: "Success",
          description: "Account created successfully!"
        });

        return user;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function - simple email/password login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simple validation - in production you'd validate against a backend
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Create user object for demo purposes
      const user = {
        email: email,
        displayName: email.split('@')[0],
        photoURL: ''
      };
      
      // Try to create JWT token but don't fail if it doesn't work
      try {
        const jwtResponse = await ApiService.createJWT(user.email);
        console.log('JWT created successfully for:', user.email, jwtResponse);
      } catch (jwtError) {
        console.warn('JWT creation failed, proceeding without backend auth:', jwtError.message);
        // Continue with login even if JWT fails - this is expected in development
      }
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));

      toast({
        title: "Success",
        description: "Logged in successfully!"
      });

      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Login function using Firebase
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Create user object for our system
      const user = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL || ''
      };
      
      // Try to create JWT token but don't fail if it doesn't work
      try {
        const jwtResponse = await ApiService.createJWT(user.email);
        console.log('JWT created successfully for Google login:', user.email, jwtResponse);
      } catch (jwtError) {
        console.warn('JWT creation failed for Google login, proceeding without backend auth:', jwtError.message);
        // Continue with login even if JWT fails - this is expected in development
      }
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));

      toast({
        title: "Success",
        description: "Logged in with Google successfully!"
      });

      return user;
    } catch (error) {
      console.error('Google login error:', error);
      
      let errorMessage = "Google login failed";
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Google login. Please check your Firebase configuration.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login was cancelled";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function with backend call to clear HTTP-only cookie and Firebase signOut
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Clear backend JWT cookie
      await ApiService.logout();
      setCurrentUser(null);
      
      toast({
        title: "Success",
        description: "Logged out successfully!"
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still log out locally even if backend call fails
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      
      toast({
        title: "Success", // Still show success since local logout worked
        description: "Logged out successfully!"
      });
    }
  };

  useEffect(() => {
    // Check for existing user session on app load
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          console.log('User restored from localStorage:', user.email);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
