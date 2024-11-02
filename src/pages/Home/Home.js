// src/pages/Home/Home.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <h1>Welcome to OneStore</h1>
      {isAuthenticated && user && <h2>Hi {user.name}!</h2>}
    </div>
  );
};

export default Home;
