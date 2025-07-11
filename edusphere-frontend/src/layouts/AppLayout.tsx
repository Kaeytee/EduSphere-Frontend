import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from '../app/components/appNavbar';
import AppSidebar from '../app/components/appSidebar';

/**
 * Main application layout component for authenticated users
 * Provides consistent layout structure with sidebar navigation and top navbar
 * Used for all protected routes within the /app path
 */
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar navigation - hidden on mobile, shown on desktop */}
      <AppSidebar />
      
      <div className="lg:ml-64">
        {/* Top navigation bar */}
        <AppNavbar />
        
        {/* Main content area */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
