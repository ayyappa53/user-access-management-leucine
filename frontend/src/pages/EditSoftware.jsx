import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const EditSoftware = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessLevels: [],
  });

  const [loading, setLoading] = useState(true);

  const availableAccessLevels = ['Read', 'Write', 'Admin'];

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const response = await api.get(`/software/${id}`);
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          accessLevels: response.data.accessLevels || [],
        });
      } catch (error) {
        toast.error('Failed to fetch software details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSoftware();
  }, [id]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccessLevelChange = (level) => {
    setFormData((prev) => ({
      ...prev,
      accessLevels: Array.isArray(prev.accessLevels)
        ? (prev.accessLevels.includes(level)
            ? prev.accessLevels.filter((l) => l !== level)
            : [...prev.accessLevels, level])
        : [level],
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error('Software name is required');
    if (formData.name.length < 3) return toast.error('Name must be at least 3 characters');
    if (!formData.description.trim()) return toast.error('Description is required');
    if (formData.description.length < 10) return toast.error('Description must be at least 10 characters');
    if (!formData.accessLevels.length) return toast.error('Select at least one access level');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.put(`/software/${id}`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        accessLevels: formData.accessLevels,
      });
      toast.success('Software updated successfully');
      navigate('/software');
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="flex justify-center">
          <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="card-header">
              <h1 className="card-title">Edit Software</h1>
              <p className="card-subtitle">Update software details</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Software Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  rows={4}
                  disabled={loading}
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Access Levels *</label>
                <div className="grid gap-3">
                  {availableAccessLevels.map((level) => (
                    <label
                      key={level}
                      className="flex align-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData.accessLevels) && formData.accessLevels.includes(level)}
                        onChange={() => handleAccessLevelChange(level)}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{level}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Software'}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSoftware;
