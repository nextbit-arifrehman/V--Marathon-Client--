import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { MarathonProvider } from './context/MarathonContext.jsx';
import { ApplicationProvider } from './context/ApplicationContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Marathons from './pages/Marathons.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MarathonDetails from './pages/MarathonDetails.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AuthRoute from './components/AuthRoute.jsx';
import { Toaster } from "./components/ui/toaster.jsx";

function AppContent() {
  const location = useLocation();
  
  // Define valid routes that should show navbar and footer
  const validRoutes = [
    '/',
    '/login', 
    '/register', 
    '/marathons', 
    '/about'
  ];
  
  // Check if current path is valid or matches valid patterns
  const isValidRoute = validRoutes.includes(location.pathname) || 
                      location.pathname.startsWith('/marathon/') || 
                      location.pathname.startsWith('/dashboard');
  
  const is404Page = !isValidRoute;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      {!is404Page && <Navbar />}
      <main className={`flex-1 ${!is404Page ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } 
          />
          <Route path="/marathons" element={<Marathons />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/marathon/:id"
            element={
              <PrivateRoute>
                <MarathonDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!is404Page && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <MarathonProvider>
            <ApplicationProvider>
              <AppContent />
            </ApplicationProvider>
          </MarathonProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;