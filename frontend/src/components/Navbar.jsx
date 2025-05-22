import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isManager, isEmployee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            User Access Management
          </Link>
          <div className="navbar-menu">
            <Link 
              to="/login" 
              className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`navbar-link ${isActive('/signup') ? 'active' : ''}`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          User Access Management
        </Link>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/dashboard" 
            className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/software" 
            className={`navbar-link ${isActive('/software') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Software
          </Link>

          {isEmployee() && (
            <Link 
              to="/request-access" 
              className={`navbar-link ${isActive('/request-access') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Request Access
            </Link>
          )}

          {(isManager() || isAdmin()) && (
            <Link 
              to="/pending-requests" 
              className={`navbar-link ${isActive('/pending-requests') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Pending Requests
            </Link>
          )}

          {isAdmin() && (
            <Link 
              to="/create-software" 
              className={`navbar-link ${isActive('/create-software') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Create Software
            </Link>
          )}

          <div className="navbar-user">
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className={`role-badge badge-${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
            
            <div className="user-dropdown">
              <button className="dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;