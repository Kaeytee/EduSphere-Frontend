import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ROLE_HIERARCHY, UserRole } from './authTypes';
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
   * Initialize authentication state on component mount
   * Checks for existing session in localStorage
   */
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        const savedUser = localStorage.getItem('edusphere_user');
        const savedToken = localStorage.getItem('edusphere_token');
        
        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser) as User;
          setUser(parsedUser);
          setToken(savedToken);
          
          // Verify token is still valid by fetching profile
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
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        localStorage.removeItem('edusphere_user');
        localStorage.removeItem('edusphere_token');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
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
      
      // Store user data and token
      localStorage.setItem('edusphere_user', JSON.stringify(response.user));
      localStorage.setItem('edusphere_token', response.token);
      setUser(response.user);
      setToken(response.token);
      
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
      
      // Store user data and token
      localStorage.setItem('edusphere_user', JSON.stringify(response.user));
      localStorage.setItem('edusphere_token', response.token);
      setUser(response.user);
      setToken(response.token);
      
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
