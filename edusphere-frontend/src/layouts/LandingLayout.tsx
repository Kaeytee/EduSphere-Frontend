import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../landing/components/navbar';
import Footer from '../landing/components/footer';

/**
 * Landing page layout component
 * Provides consistent layout structure for public pages (home, about, contact, login, signup)
 * Includes navbar and footer for branding and navigation
 */
const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation header */}
      <Navbar />
      
      {/* Main content area - renders child routes */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingLayout;
