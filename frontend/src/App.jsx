 import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500'
          }
        }} 
      />
      <Routes>
        {/* Root path defaults strictly to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes Group - Single Catch-All to prevent remounting */}
        <Route element={<ProtectedRoute />}>
          <Route path="*" element={<DashboardLayout />} />
        </Route>
      </Routes>
    </>
  );
}