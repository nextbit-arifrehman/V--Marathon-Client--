// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hollydemon.vercel.app';

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// API Headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
};