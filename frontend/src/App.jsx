 import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Appointments from './pages/Appointments';
import Enquiries from './pages/Enquiries';
import Calls from './pages/Calls';

// Clean ProtectedRoute layout wrapper with strict token verification
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // Strictly verify token exists and is a non-empty string
  const isAuthenticated = token && token !== 'null' && token !== 'undefined';

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Root path defaults strictly to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes Group */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/calls" element={<Calls />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}