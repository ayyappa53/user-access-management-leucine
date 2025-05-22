import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="flex justify-center align-center" style={{ minHeight: '50vh' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card">
            <div className="card-header text-center">
              <h1 className="card-title text-red-600">Access Denied</h1>
              <p className="card-subtitle">
                You don't have permission to access this page.
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Required role(s): {roles.join(', ')}
              </p>
              <p className="text-gray-600 mb-4">
                Your role: {user.role}
              </p>
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;