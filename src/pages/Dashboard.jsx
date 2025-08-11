import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, List, Calendar, Trophy, Menu } from 'lucide-react';
import AddMarathon from './AddMarathon';
import MyMarathonList from './MyMarathonList';
import MyApplyList from './MyApplyList';
import { usePageTitle } from '../hooks/usePageTitle.js';

const Dashboard = () => {
  usePageTitle('Dashboard');
  
  const { currentUser } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    marathonCount: 0,
    applicationCount: 0,
    totalRegistrations: 0,
    upcomingCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Sidebar open state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, [location.pathname]); // Refetch when navigation changes

  useEffect(() => {
    // Listen for custom events to refresh stats
    const handleRefresh = () => {
      fetchDashboardStats();
    };

    window.addEventListener('marathon-created', handleRefresh);
    window.addEventListener('application-submitted', handleRefresh);
    
    return () => {
      window.removeEventListener('marathon-created', handleRefresh);
      window.removeEventListener('application-submitted', handleRefresh);
    };
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const ApiService = (await import('../services/api.js')).default;
      const data = await ApiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        marathonCount: 0,
        applicationCount: 0,
        totalRegistrations: 0,
        upcomingCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const DashboardHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {currentUser?.name || 'Runner'}!</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Add Marathon</CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Create and organize new marathon events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/add-marathon">
              <Button className="w-full">Create Marathon</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <List className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">My Marathons</CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              View and manage marathons you've created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/my-marathons">
              <Button variant="outline" className="w-full">View Marathons</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">My Applications</CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Track your marathon registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/my-applications">
              <Button variant="outline" className="w-full">View Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header with hamburger */}
      <header className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 shadow-md">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto transform
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:static md:inset-auto
          `}
          onClick={() => setSidebarOpen(false)} // Close sidebar on link click (mobile)
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Dashboard</h2>
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Trophy className="h-5 w-5" />
                <span>Overview</span>
              </Link>
              <Link
                to="/dashboard/add-marathon"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/add-marathon') 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>Add Marathon</span>
              </Link>
              <Link
                to="/dashboard/my-marathons"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/my-marathons') 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
                <span>My Marathons</span>
              </Link>
              <Link
                to="/dashboard/my-applications"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/my-applications') 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>My Applications</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main
          className="flex-1 p-6 md:p-8"
          // On mobile, when sidebar open, disable scroll behind sidebar
          style={{ overflowY: sidebarOpen ? 'hidden' : 'auto' }}
        >
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="add-marathon" element={<AddMarathon />} />
            <Route path="my-marathons" element={<MyMarathonList />} />
            <Route path="my-applications" element={<MyApplyList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
