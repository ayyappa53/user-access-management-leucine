import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, isAdmin, isManager, isEmployee } = useAuth();
  const [stats, setStats] = useState({
    totalSoftware: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const softwareResponse = await api.get('/software');
      const totalSoftware = softwareResponse.data.software.length;
      const requestsResponse = await api.get('/requests');
      const requests = requestsResponse.data.requests;
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(req => req.status === 'Pending').length;
      const approvedRequests = requests.filter(req => req.status === 'Approved').length;
      setStats({
        totalSoftware,
        totalRequests,
        pendingRequests,
        approvedRequests
      });
      const sortedRequests = requests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon';
    } else if (hour >= 17) {
      greeting = 'Good evening';
    }
    return `${greeting}, ${user.username}!`;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="flex justify-center align-center" style={{ minHeight: '50vh' }}>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Welcome Section */}
        <div className="card mb-4">
          <div className="card-header">
            <h1 className="card-title">{getWelcomeMessage()}</h1>
            <p className="card-subtitle">
              Welcome to your dashboard. Here's an overview of your system.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-4 mb-4">
          <div className="card">
            <div className="flex justify-between align-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-600">{stats.totalSoftware}</h3>
                <p className="text-gray-600">Total Software</p>
              </div>
              <div className="text-blue-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3v6h8l-8-6zM6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8h-8V2H6z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between align-center">
              <div>
                <h3 className="text-2xl font-bold text-green-600">{stats.totalRequests}</h3>
                <p className="text-gray-600">Total Requests</p>
              </div>
              <div className="text-green-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-2V9h2v2zm0-4h-2V5h2v2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between align-center">
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</h3>
                <p className="text-gray-600">Pending Requests</p>
              </div>
              <div className="text-yellow-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between align-center">
              <div>
                <h3 className="text-2xl font-bold text-green-600">{stats.approvedRequests}</h3>
                <p className="text-gray-600">Approved Requests</p>
              </div>
              <div className="text-green-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-2 mb-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
              <p className="card-subtitle">Common tasks you can perform</p>
            </div>
            
            <div className="grid gap-2">
              <Link to="/software" className="btn btn-outline">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3v6h8l-8-6zM6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8h-8V2H6z"/>
                </svg>
                View Software
              </Link>
              
              {isEmployee() && (
                <Link to="/request-access" className="btn btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Request Access
                </Link>
              )}
              
              {(isManager() || isAdmin()) && (
                <Link to="/pending-requests" className="btn btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Review Requests
                </Link>
              )}
              
              {isAdmin() && (
                <Link to="/create-software" className="btn btn-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Create Software
                </Link>
              )}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Requests</h2>
              <p className="card-subtitle">Latest access requests</p>
            </div>
            
            {recentRequests.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex justify-between align-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{request.software.name}</p>
                      <p className="text-sm text-gray-600">
                        {request.user.username} • {request.accessType}
                      </p>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {recentRequests.length > 0 && (
              <div className="mt-4 text-center">
                {(isManager() || isAdmin()) ? (
                  <Link to="/pending-requests" className="btn btn-sm btn-outline">
                    View All Requests
                  </Link>
                ) : (
                  <Link to="/request-access" className="btn btn-sm btn-outline">
                    Make New Request
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Role: {user.role}</h2>
            <p className="card-subtitle">What you can do with your current permissions</p>
          </div>
          
          <div className="grid grid-3">
            {isEmployee() && (
              <>
                <div className="text-center p-4">
                  <div className="text-blue-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M13 3v6h8l-8-6zM6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8h-8V2H6z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">View Software</h3>
                  <p className="text-sm text-gray-600">Browse available software applications</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-green-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Request Access</h3>
                  <p className="text-sm text-gray-600">Submit requests for software access</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-purple-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Track Requests</h3>
                  <p className="text-sm text-gray-600">Monitor your request status</p>
                </div>
              </>
            )}
            
            {isManager() && (
              <>
                <div className="text-center p-4">
                  <div className="text-blue-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Approve Requests</h3>
                  <p className="text-sm text-gray-600">Review and approve access requests</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-red-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Reject Requests</h3>
                  <p className="text-sm text-gray-600">Decline inappropriate requests</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-green-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-2V9h2v2zm0-4h-2V5h2v2z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Manage Workflow</h3>
                  <p className="text-sm text-gray-600">Oversee the approval process</p>
                </div>
              </>
            )}
            
            {isAdmin() && (
              <>
                <div className="text-center p-4">
                  <div className="text-purple-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Create Software</h3>
                  <p className="text-sm text-gray-600">Add new software to the system</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-blue-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Full Access</h3>
                  <p className="text-sm text-gray-600">Complete system administration</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="text-red-600 mb-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Manage System</h3>
                  <p className="text-sm text-gray-600">Delete and modify software</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;