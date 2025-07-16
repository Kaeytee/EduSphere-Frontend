import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { router } from './router';

/**
 * Main App component that provides authentication and notification contexts and routing
 * This is the root component that wraps the entire application
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
