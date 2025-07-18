import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../contexts/useAuth";

/**
 * HomeRedirect component interface
 */
interface HomeRedirectProps {
  children: React.ReactNode;
}

/**
 * HomeRedirect component that redirects authenticated users from homepage to dashboard
 * This prevents authenticated users from seeing sign-in/sign-up content on the homepage
 * 
 * Time Complexity: O(1) - Constant time for authentication check and redirect
 * Space Complexity: O(1) - Constant space usage
 */
const HomeRedirect: React.FC<HomeRedirectProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  /**
   * Effect to handle redirect logic for authenticated users
   * Redirects to dashboard if user is authenticated
   */
  useEffect(() => {
    // Wait for authentication state to be determined
    if (!isLoading && user) {
      // Redirect authenticated users to dashboard
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  /**
   * Show loading state while authentication is being determined
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  /**
   * If user is authenticated, show loading (will redirect)
   * If user is not authenticated, show the homepage content
   */
  return user ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default HomeRedirect;
