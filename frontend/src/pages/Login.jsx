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
    }
  };

  return (
    <LoginSignup 
      onLogin={handleLogin}
      onSignup={handleSignup}
      error={error}
    />
  );
}