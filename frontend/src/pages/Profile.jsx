import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests');
      
      let requests = response.data.requests;
      if (user.role === 'Employee') {
        requests = requests.filter(req => req.user.id === user.id);
      }
      
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setUserRequests(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Approved':
        return 'badge-approved';
      case 'Rejected':
        return 'badge-rejected';
      default:
        return 'badge-pending';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'badge-admin';
      case 'Manager':
        return 'badge-manager';
      case 'Employee':
        return 'badge-employee';
      default:
        return 'badge-employee';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRequestStats = () => {
    const pending = userRequests.filter(req => req.status === 'Pending').length;
    const approved = userRequests.filter(req => req.status === 'Approved').length;
    const rejected = userRequests.filter(req => req.status === 'Rejected').length;
    
    return { pending, approved, rejected, total: userRequests.length };
  };

  const stats = getRequestStats();

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Profile Header */}
        <div className="card mb-4">
          <div className="card-header">
            <div className="flex justify-between align-center">
              <div>
                <h1 className="card-title">Profile</h1>
                <p className="card-subtitle">Your account information and activity</p>
              </div>
              <div className="flex align-center gap-4">
                <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-2">
            <div>
              <h3 className="font-medium mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="form-label">Username</label>
                  <div className="form-input bg-gray-50">
                    {user.username}
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Role</label>
                  <div className="form-input bg-gray-50">
                    {user.role}
                  </div>
                </div>
                
                <div>
                  <label className="form-label">User ID</label>
                  <div className="form-input bg-gray-50">
                    #{user.id}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Request Statistics</h3>
              <div className="grid grid-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-800">Total Requests</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-yellow-800">Pending</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-green-800">Approved</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-red-800">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {user.role === 'Employee' ? 'Your Requests' : 'All Requests'}
            </h2>
            <p className="card-subtitle">
              {user.role === 'Employee' 
                ? 'History of your access requests' 
                : 'Complete request history in the system'
              }
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : userRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-2V9h2v2zm0-4h-2V5h2v2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Requests Found</h3>
              <p className="text-gray-500 mb-4">
                {user.role === 'Employee' 
                  ? "You haven't made any access requests yet." 
                  : "No requests have been made in the system yet."
                }
              </p>
              {user.role === 'Employee' && (
                <a href="/request-access" className="btn btn-primary">
                  Make Your First Request
                </a>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th>User</th>
                    <th>Access Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="font-medium">{request.software.name}</td>
                      <td>
                        <div>
                          <div className="font-medium">{request.user.username}</div>
                          <div className="text-sm text-gray-500">{request.user.role}</div>
                        </div>
                      </td>
                      <td>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {request.accessType}
                        </span>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="text-sm truncate" title={request.reason}>
                            {request.reason}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">
                        {formatDate(request.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;