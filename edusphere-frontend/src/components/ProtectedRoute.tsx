import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  minimumRole?: UserRole;
  fallbackPath?: string;
}

/**
 * Loading spinner component for authentication checks
 */
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="text-gray-600 font-medium">Verifying authentication...</p>
    </div>
  </div>
);

/**
 * Unauthorized access component shown when user lacks required permissions
 */
const UnauthorizedAccess: React.FC<{ userRole?: UserRole; requiredRole?: UserRole }> = ({ 
  userRole, 
  requiredRole 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg 
            className="h-8 w-8 text-red-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        You don't have the required permissions to access this page.
        {userRole && requiredRole && (
          <span className="block mt-2 text-sm">
            Your role: <span className="font-medium">{userRole}</span><br/>
            Required role: <span className="font-medium">{requiredRole}</span>
          </span>
        )}
      </p>
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
      >
        Go Back
      </button>
    </div>
  </div>
);

/**
 * Protected route component that handles authentication and authorization
 * Supports both exact role matching and minimum role requirements
 * 
 * @param children - Child components to render if authorized
 * @param requiredRole - Exact role required for access
 * @param minimumRole - Minimum role level required for access
 * @param fallbackPath - Custom redirect path for unauthorized users
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  minimumRole,
  fallbackPath = '/login'
}) => {
  const { user, isLoading, isAuthenticated, hasRole, hasMinimumRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check exact role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <UnauthorizedAccess userRole={user?.role} requiredRole={requiredRole} />;
  }

  // Check minimum role requirement
  if (minimumRole && !hasMinimumRole(minimumRole)) {
    return <UnauthorizedAccess userRole={user?.role} requiredRole={minimumRole} />;
  }

  // Render protected content if all checks pass
  return <>{children}</>;
};

/**
 * Admin-only protected route component
 * Requires ADMIN role for access
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={UserRole.ADMIN}>
    {children}
  </ProtectedRoute>
);

/**
 * Room Admin protected route component
 * Requires ROOM_ADMIN role or higher for access
 */
export const RoomAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute minimumRole={UserRole.ROOM_ADMIN}>
    {children}
  </ProtectedRoute>
);

/**
 * User protected route component
 * Requires any authenticated user (USER role or higher)
 */
export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute minimumRole={UserRole.USER}>
    {children}
  </ProtectedRoute>
);

/**
 * Public route component that redirects authenticated users
 * Useful for login/signup pages that shouldn't be accessible when logged in
 */
export const PublicRoute: React.FC<{ 
  children: React.ReactNode; 
  redirectTo?: string 
}> = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
