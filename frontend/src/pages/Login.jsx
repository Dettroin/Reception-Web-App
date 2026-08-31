import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import LoginSignup from '../components/LoginSignup';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err; // Re-throw to prevent loading spinner from hanging if we don't handle it in component
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setError(''); // clear error
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
      throw err;
    }
  };

  const handleResetPassword = async (email, code, password) => {
    try {
      const res = await API.post('/auth/reset-password', { email, code, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    }
  };

  return (
    <LoginSignup 
      onLogin={handleLogin}
      onSignup={handleSignup}
      onForgotPassword={handleForgotPassword}
      onResetPassword={handleResetPassword}
      error={error}
    />
  );
}