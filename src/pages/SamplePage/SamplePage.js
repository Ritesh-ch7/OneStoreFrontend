// src/pages/SamplePage/SamplePage.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SamplePage = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div>You need to log in to view this page.</div>;
  }

  return (
    <div>
      <h1>Welcome to the Sample Page!</h1>
      <p>Hello, {user.name}!</p>
    </div>
  );
};

export default SamplePage;
