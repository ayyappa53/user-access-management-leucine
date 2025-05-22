import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const SoftwareList = () => {
  const { isAdmin } = useAuth();
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchSoftware();
  }, []);

  const fetchSoftware = async () => {
    try {
      setLoading(true);
      const response = await api.get('/software');
      setSoftware(response.data.software);
    } catch (error) {
      console.error('Error fetching software:', error);
      toast.error('Failed to load software list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (softwareId, softwareName) => {
    if (!window.confirm(`Are you sure you want to delete "${softwareName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(softwareId);
      await api.delete(`/software/${softwareId}`);
      
      setSoftware(prev => prev.filter(s => s.id !== softwareId));
      toast.success(`${softwareName} has been deleted successfully`);
    } catch (error) {
      console.error('Error deleting software:', error);
      
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        
        if (errorData.dependencies) {
          const { accessRequests, userPermissions } = errorData.dependencies;
          let dependencyMessage = `Cannot delete "${softwareName}" because it has:\n`;
          
          if (accessRequests > 0) {
            dependencyMessage += `• ${accessRequests} pending access request${accessRequests > 1 ? 's' : ''}\n`;
          }
          if (userPermissions > 0) {
            dependencyMessage += `• ${userPermissions} user permission${userPermissions > 1 ? 's' : ''}\n`;
          }
          
          dependencyMessage += '\nPlease remove these dependencies first.';
          
          toast.error(dependencyMessage, {
            autoClose: 8000,
            style: { whiteSpace: 'pre-line' }
          });
        } else {
          toast.error(errorData.message || 'Cannot delete software. It may be referenced by other records.');
        }
      } else if (error.response?.status === 404) {
        toast.error('Software not found. It may have already been deleted.');
        // Refresh the list to sync with server
        fetchSoftware();
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete software');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredSoftware = software.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccessLevelBadge = (level) => {
    const badgeClasses = {
      'Read': 'bg-blue-100 text-blue-800',
      'Write': 'bg-green-100 text-green-800',
      'Admin': 'bg-purple-100 text-purple-800'
    };
    
    return badgeClasses[level] || 'bg-gray-100 text-gray-800';
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
        
        <div className="card mb-4">
          <div className="card-header">
            <div className="flex justify-between align-center">
              <div>
                <h1 className="card-title">Software Applications</h1>
                <p className="card-subtitle">
                  Browse available software and their access levels
                </p>
              </div>
              {isAdmin() && (
                <Link to="/create-software" className="btn btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Software
                </Link>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <div className="relative">
              <input
                type="text"
                className="form-input pl-9"
                placeholder="Search software by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                
              </div>
            </div>
          </div>
        </div>

        {filteredSoftware.length === 0 ? (
          <div className="card">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                  <path d="M13 3v6h8l-8-6zM6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8h-8V2H6z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchTerm ? 'No Software Found' : 'No Software Available'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `No software matches your search for "${searchTerm}"`
                  : 'There are no software applications in the system yet.'
                }
              </p>
              {!searchTerm && isAdmin() && (
                <Link to="/create-software" className="btn btn-primary">
                  Create First Software
                </Link>
              )}
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredSoftware.map((app) => (
              <div key={app.id} className="card">
                <div className="card-header">
                  <div className="flex justify-between align-center">
                    <h3 className="card-title text-lg">{app.name}</h3>
                    {isAdmin() && (
                      <div className="flex gap-2">
                        <Link
  to={`/edit-software/${app.id}`}
  className="btn btn-sm btn-secondary"
  title="Edit Software"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 
      0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 
      1.83-1.83z"/>
  </svg>
</Link>

                        <button
                          onClick={() => handleDelete(app.id, app.name)}
                          disabled={deleteLoading === app.id}
                          className="btn btn-sm btn-danger"
                          title="Delete Software"
                        >
                          {deleteLoading === app.id ? (
                            <span className="loading-spinner"></span>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {app.description}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    Available Access Levels:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.accessLevels.map((level, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAccessLevelBadge(level)}`}
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    to="/request-access"
                    state={{ selectedSoftware: app }}
                    className="btn btn-outline btn-sm btn-full"
                  >
                    Request Access
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSoftware.length > 0 && (
          <div className="card mt-4">
            <div className="flex justify-between align-center">
              <div>
                <p className="text-gray-600">
                  Showing {filteredSoftware.length} of {software.length} software applications
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="btn btn-sm btn-outline"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareList;