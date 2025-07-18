import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from "../contexts/useAuth";

/**
 * Guest Route Component
 * 
 * Protects routes that should only be accessible to non-authenticated users
 * (such as login and signup pages). Redirects authenticated users to dashboard.
 * 
 * @param children - The component to render if user is not authenticated
 * @param redirectTo - The path to redirect to if user is authenticated (default: '/app/dashboard')
 */
interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * GuestRoute component implementation
 * 
 * Time Complexity: O(1) - Simple conditional rendering
 * Space Complexity: O(1) - No additional data structures
 */
const GuestRoute: React.FC<GuestRouteProps> = ({ 
  children, 
  redirectTo = '/app/dashboard' 
}) => {
  const { user, isLoading } = useAuth();

  /**
   * Show loading state while authentication is being verified
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  /**
   * Redirect authenticated users to dashboard
   * Allow non-authenticated users to access the route
   */
  return user ? <Navigate to={redirectTo} replace /> : <>{children}</>;
};

export default GuestRoute;
