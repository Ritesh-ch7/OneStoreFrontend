// src/pages/Login/Login.js
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to OneStore</h1>
        <p className="login-subtitle">Your centralized storage solution</p>
        <button onClick={() => loginWithRedirect()} className="login-button">
          Log in with Auth0
        </button>
      </div>
    </div>
  );
};

export default Login;
