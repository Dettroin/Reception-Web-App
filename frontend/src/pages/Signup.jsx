import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Signup() {
  // Our new LoginSignup component handles both flows in one unified UI,
  // so we just redirect any /signup visitors to the unified /login page.
  return <Navigate to="/login" replace />;
}