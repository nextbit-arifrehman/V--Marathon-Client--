import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApplication } from '../context/ApplicationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { Search, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { useToast } from '../hooks/use-toast.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

const MyApplyList = () => {
  usePageTitle('My Applications');
  
  const { currentUser } = useAuth();
  const { applications, loading, fetchMyApplications, updateApplication, deleteApplication } = useApplication();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [editingApplication, setEditingApplication] = useState(null);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (currentUser) {
      console.log('Fetching applications for user:', currentUser.email);
      fetchMyApplications();
    }
  }, [currentUser]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch applications when debounced search term changes
  useEffect(() => {
    if (currentUser && debouncedSearchTerm !== searchTerm) {
      fetchMyApplications(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, currentUser]);

  // Server-side search is handled in fetchApplications, no client-side filtering needed

  const handleEdit = (application) => {
    setEditingApplication(application);
    setEditData({
      firstName: application.firstName,
      lastName: application.lastName,
      contactNumber: application.contactNumber,
      additionalInfo: application.additionalInfo || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateApplication(editingApplication._id, editData);
      setEditingApplication(null);
    } catch (error) {
      // Error handling is done in the context
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      await deleteApplication(applicationId);
    } catch (error) {
      // Error handling is done in the context
      console.error('Delete failed:', error);
    }
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter(application =>
    application.marathonTitle?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    application.firstName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    application.lastName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Marathon Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your marathon registrations and applications
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by marathon title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Applications Table */}
        {filteredApplications.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm ? 'No applications match your search.' : 'You haven\'t applied for any marathons yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">My Applications</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Total: {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900 dark:text-white min-w-[150px]">Marathon Title</TableHead>
                    <TableHead className="text-gray-900 dark:text-white hidden sm:table-cell">Start Date</TableHead>
                    <TableHead className="text-gray-900 dark:text-white hidden md:table-cell">Name</TableHead>
                    <TableHead className="text-gray-900 dark:text-white hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="text-gray-900 dark:text-white hidden lg:table-cell">Applied Date</TableHead>
                    <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        <div>
                          <div className="font-medium">{application.marathonTitle}</div>
                          <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(application.marathonStartDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {application.firstName} {application.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                        {new Date(application.marathonStartDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 hidden md:table-cell">
                        {application.firstName} {application.lastName}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                        {application.contactNumber}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                        {new Date(application.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(application)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="dark:bg-gray-800">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-white">Edit Application</DialogTitle>
                                <DialogDescription className="text-gray-600 dark:text-gray-300">
                                  Update your marathon application details
                                </DialogDescription>
                              </DialogHeader>
                              
                              {editingApplication && (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="marathonTitle">Marathon Title</Label>
                                      <Input
                                        id="marathonTitle"
                                        value={editingApplication.marathonTitle}
                                        readOnly
                                        className="bg-gray-100 dark:bg-gray-700"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="startDate">Start Date</Label>
                                      <Input
                                        id="startDate"
                                        value={new Date(editingApplication.marathonStartDate).toLocaleDateString()}
                                        readOnly
                                        className="bg-gray-100 dark:bg-gray-700"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="firstName">First Name</Label>
                                      <Input
                                        id="firstName"
                                        value={editData.firstName}
                                        onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="lastName">Last Name</Label>
                                      <Input
                                        id="lastName"
                                        value={editData.lastName}
                                        onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="contactNumber">Contact Number</Label>
                                    <Input
                                      id="contactNumber"
                                      value={editData.contactNumber}
                                      onChange={(e) => setEditData({...editData, contactNumber: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Textarea
                                      id="additionalInfo"
                                      value={editData.additionalInfo}
                                      onChange={(e) => setEditData({...editData, additionalInfo: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button type="submit" className="flex-1">Update</Button>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setEditingApplication(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(application._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyApplyList;

