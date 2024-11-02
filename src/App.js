// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // Import the Dashboard component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Update the path */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
