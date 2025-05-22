import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const CreateSoftware = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessLevels: ['Read']
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const availableAccessLevels = ['Read', 'Write', 'Admin'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAccessLevelChange = (level) => {
    setFormData(prev => ({
      ...prev,
      accessLevels: prev.accessLevels.includes(level)
        ? prev.accessLevels.filter(l => l !== level)
        : [...prev.accessLevels, level]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Software name is required');
      return false;
    }

    if (formData.name.length < 3) {
      toast.error('Software name must be at least 3 characters long');
      return false;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return false;
    }

    if (formData.accessLevels.length === 0) {
      toast.error('At least one access level must be selected');
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
      const response = await api.post('/software', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        accessLevels: formData.accessLevels
      });

      toast.success(`${response.data.software.name} has been created successfully!`);
      navigate('/software');
    } catch (error) {
      console.error('Error creating software:', error);
      const message = error.response?.data?.message || 'Failed to create software';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      accessLevels: ['Read']
    });
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="flex justify-center">
          <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="card-header">
              <h1 className="card-title">Create New Software</h1>
              <p className="card-subtitle">
                Add a new software application to the system
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Software Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter software name (e.g., Project Management Tool)"
                  disabled={loading}
                  maxLength={100}
                />
                <small className="text-gray-500">
                  Choose a descriptive name for the software
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of what this software does..."
                  disabled={loading}
                  maxLength={500}
                  rows={4}
                />
                <small className="text-gray-500">
                  {formData.description.length}/500 characters
                </small>
              </div>
              
              <div className="form-group">
                <label className="form-label">Access Levels *</label>
                <p className="text-sm text-gray-600 mb-3">
                  Select the access levels that will be available for this software
                </p>
                
                <div className="grid gap-3">
                  {availableAccessLevels.map((level) => (
                    <label key={level} className="flex align-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.accessLevels.includes(level)}
                        onChange={() => handleAccessLevelChange(level)}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{level}</div>
                        <div className="text-sm text-gray-600">
                          {level === 'Read' && 'View-only access to the software'}
                          {level === 'Write' && 'Can create and edit content'}
                          {level === 'Admin' && 'Full administrative privileges'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {formData.accessLevels.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Selected access levels:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.accessLevels.map((level) => (
                        <span
                          key={level}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Create Software
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
            
            {(formData.name || formData.description) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-3">Preview</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-lg mb-2">
                    {formData.name || 'Software Name'}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {formData.description || 'Software description will appear here...'}
                  </p>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Access Levels: </span>
                    {formData.accessLevels.length > 0 ? (
                      <div className="inline-flex flex-wrap gap-2 mt-1">
                        {formData.accessLevels.map((level) => (
                          <span
                            key={level}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">None selected</span>
                    )}
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

export default CreateSoftware;