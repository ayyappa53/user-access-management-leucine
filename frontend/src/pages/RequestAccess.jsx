import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const RequestAccess = () => {
  const [formData, setFormData] = useState({
    softwareId: '',
    accessType: '',
    reason: ''
  });
  const [software, setSoftware] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSoftware();
  }, []);

  useEffect(() => {
    const preSelectedSoftware = location.state?.selectedSoftware;
    if (preSelectedSoftware) {
      setFormData(prev => ({
        ...prev,
        softwareId: preSelectedSoftware.id.toString()
      }));
      setSelectedSoftware(preSelectedSoftware);
    }
  }, [location.state]);

  const fetchSoftware = async () => {
    try {
      setFetchingData(true);
      const response = await api.get('/software');
      setSoftware(response.data.software);
    } catch (error) {
      console.error('Error fetching software:', error);
      toast.error('Failed to load software list');
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'softwareId') {
      const selected = software.find(s => s.id.toString() === value);
      setSelectedSoftware(selected || null);
      
      // Reset access type when software changes
      setFormData(prev => ({
        ...prev,
        accessType: ''
      }));
    }
  };

  const validateForm = () => {
    if (!formData.softwareId) {
      toast.error('Please select a software');
      return false;
    }

    if (!formData.accessType) {
      toast.error('Please select an access type');
      return false;
    }

    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for your request');
      return false;
    }

    if (formData.reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/requests', {
        softwareId: parseInt(formData.softwareId),
        accessType: formData.accessType,
        reason: formData.reason.trim()
      });

      toast.success('Access request submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating request:', error);
      const message = error.response?.data?.message || 'Failed to submit request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      softwareId: '',
      accessType: '',
      reason: ''
    });
    setSelectedSoftware(null);
  };

  if (fetchingData) {
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

  if (software.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                  <path d="M13 3v6h8l-8-6zM6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8h-8V2H6z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Software Available</h3>
              <p className="text-gray-500 mb-4">
                There are no software applications available to request access to.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="flex justify-center">
          <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="card-header">
              <h1 className="card-title">Request Software Access</h1>
              <p className="card-subtitle">
                Submit a request to access software applications
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="softwareId" className="form-label">
                  Select Software *
                </label>
                <select
                  id="softwareId"
                  name="softwareId"
                  className="form-select"
                  value={formData.softwareId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Choose a software application...</option>
                  {software.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSoftware && (
                <div className="form-group">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">
                      {selectedSoftware.name}
                    </h4>
                    <p className="text-blue-700 text-sm mb-3">
                      {selectedSoftware.description}
                    </p>
                    <div>
                      <span className="text-sm font-medium text-blue-900">Available Access Levels: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedSoftware.accessLevels.map((level) => (
                          <span
                            key={level}
                            className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium"
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="accessType" className="form-label">
                  Access Type *
                </label>
                <select
                  id="accessType"
                  name="accessType"
                  className="form-select"
                  value={formData.accessType}
                  onChange={handleChange}
                  disabled={loading || !selectedSoftware}
                >
                  <option value="">Select access level...</option>
                  {selectedSoftware?.accessLevels.map((level) => (
                    <option key={level} value={level}>
                      {level} Access
                    </option>
                  ))}
                </select>
                {!selectedSoftware && (
                  <small className="text-gray-500">
                    Please select a software first
                  </small>
                )}
              </div>

              {formData.accessType && (
                <div className="form-group">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">
                      {formData.accessType} Access Description:
                    </h5>
                    <p className="text-sm text-gray-700">
                      {formData.accessType === 'Read' && 
                        'View-only access. You can browse and view content but cannot make changes.'}
                      {formData.accessType === 'Write' && 
                        'Read and write access. You can view content and create/edit your own content.'}
                      {formData.accessType === 'Admin' && 
                        'Full administrative access. You can manage all aspects of the software including user permissions.'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="reason" className="form-label">
                  Reason for Request *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  className="form-input form-textarea"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please explain why you need access to this software and how you plan to use it..."
                  disabled={loading}
                  rows={4}
                  maxLength={500}
                />
                <small className="text-gray-500">
                  {formData.reason.length}/500 characters - Provide a detailed justification
                </small>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                      Submit Request
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Reset
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/software')}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
            {formData.softwareId && formData.accessType && formData.reason && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-3">Request Summary</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid gap-3">
                    <div>
                      <span className="font-medium text-gray-700">Software: </span>
                      <span className="text-gray-900">{selectedSoftware?.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Access Type: </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {formData.accessType}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Reason: </span>
                      <p className="text-gray-900 text-sm mt-1">{formData.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;