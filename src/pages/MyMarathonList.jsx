import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarathon } from '../context/MarathonContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { Edit, Trash2, Calendar, MapPin, Users, Search } from 'lucide-react';
import EditMarathonModal from '../components/EditMarathonModal.jsx';

const MyMarathonList = () => {
  const { currentUser } = useAuth();
  const { userMarathons, loading, deleteMarathon, marathonCount } = useMarathon();
  const [filteredMarathons, setFilteredMarathons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [editingMarathon, setEditingMarathon] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    filterAndSortMarathons();
  }, [userMarathons, searchTerm, sortOrder]);

  const filterAndSortMarathons = () => {
    console.log('Filtering marathons:', userMarathons);
    let filtered = userMarathons.filter(marathon =>
      marathon.marathonTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marathon.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort marathons
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    console.log('Filtered marathons:', filtered);
    setFilteredMarathons(filtered);
  };

  const handleDeleteMarathon = async (marathonId) => {
    if (window.confirm('Are you sure you want to delete this marathon?')) {
      try {
        await deleteMarathon(marathonId);
      } catch (error) {
        console.error('Error deleting marathon:', error);
      }
    }
  };

  const handleEditMarathon = (marathon) => {
    setEditingMarathon(marathon);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMarathon(null);
  };

  const getRegistrationStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: 'upcoming', label: 'Registration Not Started', color: 'bg-gray-500' };
    } else if (now >= start && now <= end) {
      return { status: 'open', label: 'Registration Open', color: 'bg-green-500' };
    } else {
      return { status: 'closed', label: 'Registration Closed', color: 'bg-red-500' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Marathons</h1>
        <p className="text-gray-600 mt-2">Marathons you've created ({marathonCount} total)</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search marathons by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Marathons Table */}
      {filteredMarathons.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? (
                <p>No marathons found matching "{searchTerm}"</p>
              ) : (
                <div>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No marathons created yet</p>
                  <p>Start by creating your first marathon event!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marathon Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marathon Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMarathons.map((marathon) => {
                    const registrationStatus = getRegistrationStatus(
                      marathon.startRegistrationDate,
                      marathon.endRegistrationDate
                    );

                    return (
                      <tr key={marathon._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {marathon.marathonImage ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={marathon.marathonImage}
                                  alt={marathon.marathonTitle}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <Calendar className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{marathon.marathonTitle}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {marathon.location}
                              </div>
                              <div className="text-sm text-gray-500">
                                Distance: {marathon.runningDistance?.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(marathon.startRegistrationDate)} - {formatDate(marathon.endRegistrationDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Registrations: {marathon.totalRegistration || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(marathon.marathonStartDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${registrationStatus.color} text-white`}>
                            {registrationStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditMarathon(marathon)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteMarathon(marathon._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Marathon Modal */}
      <EditMarathonModal 
        marathon={editingMarathon}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default MyMarathonList;