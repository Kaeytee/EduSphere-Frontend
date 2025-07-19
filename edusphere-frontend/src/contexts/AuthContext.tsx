import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ROLE_HIERARCHY, UserRole, mapBackendRoleToUserRole } from './authTypes';
import type { User, LoginCredentials, RegistrationData } from './authTypes';
import { AuthService } from '../services/auth';

// Re-export types for convenience
export { UserRole } from './authTypes';
export type { User, AuthError, Permission } from './authTypes';

/**
 * Authentication context interface defining available methods and state
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: RegistrationData) => Promise<boolean>;
  hasRole: (requiredRole: UserRole) => boolean;
  hasMinimumRole: (minimumRole: UserRole) => boolean;
  token: string | null;
}

/**
 * Authentication context for managing user state and authentication methods
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the context for use in custom hook
export { AuthContext };
export type { AuthContextType };

/**
 * Authentication provider component props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component that manages user authentication state
 * and provides authentication methods to child components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Helper function to process user data and map backend roles to frontend roles
   * @param userData - Raw user data from backend
   * @returns User object with mapped role
   */
  const processUserData = (userData: Omit<User, 'role'> & { role: string }): User => {
    return {
      ...userData,
      role: mapBackendRoleToUserRole(userData.role)
    };
  };

  /**
   * Initialize authentication state on component mount
   * Checks for existing session in localStorage
   */
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        console.log('Initializing authentication...');
        setIsLoading(true);
        
        const savedUser = localStorage.getItem('edusphere_user');
        const savedToken = localStorage.getItem('edusphere_token');
        
        console.log('Saved user:', savedUser ? 'Found' : 'Not found');
        console.log('Saved token:', savedToken ? 'Found' : 'Not found');
        
        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser) as User;
          const processedUser = processUserData(parsedUser);
          setUser(processedUser);
          setToken(savedToken);
          console.log('Authentication restored from localStorage');
          
          // Optional: Verify token is still valid by fetching profile
          // Only do this if we want to validate on every page load
          // For now, we'll trust the stored token and validate on actual API calls
          /*
          try {
            const profile = await AuthService.getProfile();
            setUser(profile);
          } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('edusphere_user');
            localStorage.removeItem('edusphere_token');
            setUser(null);
            setToken(null);
          }
          */
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        localStorage.removeItem('edusphere_user');
        localStorage.removeItem('edusphere_token');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
        console.log('Authentication initialization complete');
      }
    };

    initializeAuth();
  }, []);

  /**
   * Authenticate user with email and password
   * @param email - User email address
   * @param password - User password
   * @returns Promise<boolean> - Success status of login attempt
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const credentials: LoginCredentials = { email, password };
      const response = await AuthService.login(credentials);
      
      // Process user data to map backend roles to frontend roles
      const processedUser = processUserData(response.user);
      
      // Store user data and token (backend returns access_token)
      localStorage.setItem('edusphere_user', JSON.stringify(processedUser));
      localStorage.setItem('edusphere_token', response.access_token);
      setUser(processedUser);
      setToken(response.access_token);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up new user
   * @param userData - User registration data
   * @returns Promise<boolean> - Success status of signup attempt
   */
  const signup = async (userData: RegistrationData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await AuthService.register(userData);
      
      // Registration successful, but doesn't return token - user needs to login
      // Just return success, don't store any auth data
      console.log('Registration successful:', response.message);
      
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out current user and clear session data
   */
  const logout = (): void => {
    localStorage.removeItem('edusphere_user');
    localStorage.removeItem('edusphere_token');
    setUser(null);
    setToken(null);
  };

  /**
   * Check if current user has specific role
   * @param requiredRole - Required user role
   * @returns boolean - True if user has exact role match
   */
  const hasRole = (requiredRole: UserRole): boolean => {
    return user?.role === requiredRole;
  };

  /**
   * Check if current user has minimum required role level
   * @param minimumRole - Minimum required role level
   * @returns boolean - True if user meets or exceeds minimum role requirement
   */
  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
  };

  /**
   * Context value object containing all authentication state and methods
   */
  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    hasRole,
    hasMinimumRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
