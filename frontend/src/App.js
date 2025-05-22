import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateSoftware from './pages/CreateSoftware';
import RequestAccess from './pages/RequestAccess';
import PendingRequests from './pages/PendingRequests';
import SoftwareList from './pages/SoftwareList';
import Profile from './pages/Profile';
import './App.css';
import EditSoftware from './pages/EditSoftware';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/software" 
                element={
                  <ProtectedRoute>
                    <SoftwareList />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/create-software" 
                element={
                  <ProtectedRoute roles={['Admin']}>
                    <CreateSoftware />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/request-access" 
                element={
                  <ProtectedRoute roles={['Employee']}>
                    <RequestAccess />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/pending-requests" 
                element={
                  <ProtectedRoute roles={['Manager', 'Admin']}>
                    <PendingRequests />
                  </ProtectedRoute>
                } 
              />
              <Route path="/edit-software/:id" element={<EditSoftware />} />

            </Routes>
          </main>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;