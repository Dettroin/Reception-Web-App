 import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Appointments from './pages/Appointments';
import Enquiries from './pages/Enquiries';
import Calls from './pages/Calls';

// Auth Guard component to protect private dashboard routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Redirect root URL to Login instead of Dashboard */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main App Routes protected inside Dashboard Layout */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/calls" element={<Calls />} />
      </Route>

      {/* Fallback Catch-All Route redirects to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}