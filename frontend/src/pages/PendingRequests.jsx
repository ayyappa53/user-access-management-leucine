import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const sortedRequests = response.data.requests.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      setProcessingRequest(requestId);
      
      const response = await api.patch(`/requests/${requestId}/status`, {
        status
      });

      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status }
            : request
        )
      );

      const action = status === 'Approved' ? 'approved' : 'rejected';
      toast.success(`Request has been ${action} successfully`);
    } catch (error) {
      console.error(`Error updating request status:`, error);
      const message = error.response?.data?.message || `Failed to ${status.toLowerCase()} request`;
      toast.error(message);
    } finally {
      setProcessingRequest(null);
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

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredRequests = requests.filter(request => {
    if (filter !== 'all' && request.status.toLowerCase() !== filter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.user.username.toLowerCase().includes(searchLower) ||
        request.software.name.toLowerCase().includes(searchLower) ||
        request.accessType.toLowerCase().includes(searchLower) ||
        request.reason.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'Pending').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length
    };
  };

  const statusCounts = getStatusCounts();

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
        <div className="card mb-4">
          <div className="card-header">
            <h1 className="card-title">Access Requests</h1>
            <p className="card-subtitle">
              Review and manage software access requests
            </p>
          </div>
          
          <div className="grid grid-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-blue-800">Total Requests</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
              <div className="text-sm text-green-800">Approved</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-red-800">Rejected</div>
            </div>
          </div>
          
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label className="form-label">Search Requests</label>
              <div className="relative">
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search by user, software, access type, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="card">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-2V9h2v2zm0-4h-2V5h2v2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchTerm || filter !== 'all' ? 'No Matching Requests' : 'No Requests Found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No access requests have been submitted yet'
                }
              </p>
              {(searchTerm || filter !== 'all') && (
                <div className="flex gap-2 justify-center">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="btn btn-outline btn-sm"
                    >
                      Clear Search
                    </button>
                  )}
                  {filter !== 'all' && (
                    <button 
                      onClick={() => setFilter('all')}
                      className="btn btn-outline btn-sm"
                    >
                      Show All
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="card table-container hidden md:block">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Software</th>
                    <th>Access Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div>
                          <div className="font-medium">{request.user.username}</div>
                          <div className="text-sm text-gray-500">{request.user.role}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{request.software.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {request.software.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
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
                      <td>
                        {request.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateRequestStatus(request.id, 'Approved')}
                              disabled={processingRequest === request.id}
                              className="btn btn-sm btn-success"
                              title="Approve Request"
                            >
                              {processingRequest === request.id ? (
                                <span className="loading-spinner"></span>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'Rejected')}
                              disabled={processingRequest === request.id}
                              className="btn btn-sm btn-danger"
                              title="Reject Request"
                            >
                              {processingRequest === request.id ? (
                                <span className="loading-spinner"></span>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="card">
                  <div className="flex justify-between align-center mb-3">
                    <div>
                      <h3 className="font-medium">{request.software.name}</h3>
                      <p className="text-sm text-gray-600">{request.user.username} • {request.user.role}</p>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Access Type: </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {request.accessType}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Reason: </span>
                      <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Date: </span>
                      <span className="text-sm text-gray-600">{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                  
                  {request.status === 'Pending' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => updateRequestStatus(request.id, 'Approved')}
                        disabled={processingRequest === request.id}
                        className="btn btn-sm btn-success flex-1"
                      >
                        {processingRequest === request.id ? (
                          <span className="loading-spinner"></span>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'Rejected')}
                        disabled={processingRequest === request.id}
                        className="btn btn-sm btn-danger flex-1"
                      >
                        {processingRequest === request.id ? (
                          <span className="loading-spinner"></span>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="card mt-4">
              <div className="flex justify-between align-center">
                <div>
                  <p className="text-gray-600">
                    Showing {filteredRequests.length} of {requests.length} requests
                    {(searchTerm || filter !== 'all') && (
                      <span>
                        {searchTerm && ` matching "${searchTerm}"`}
                        {filter !== 'all' && ` with status "${filter}"`}
                      </span>
                    )}
                  </p>
                </div>
                {(searchTerm || filter !== 'all') && (
                  <div className="flex gap-2">
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="btn btn-sm btn-outline"
                      >
                        Clear Search
                      </button>
                    )}
                    {filter !== 'all' && (
                      <button 
                        onClick={() => setFilter('all')}
                        className="btn btn-sm btn-outline"
                      >
                        Show All
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;