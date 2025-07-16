import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ROLE_HIERARCHY, UserRole } from './authTypes';
import type { User } from './authTypes';

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
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  hasRole: (requiredRole: UserRole) => boolean;
  hasMinimumRole: (minimumRole: UserRole) => boolean;
}

/**
 * Authentication context for managing user state and authentication methods
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Initialize authentication state on component mount
   * Checks for existing session in localStorage
   */
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        const savedUser = localStorage.getItem('edusphere_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        localStorage.removeItem('edusphere_user');
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
      
      // Simulate API call - Replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic password validation for demo (in production, this would be done server-side)
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Mock user data based on email for demonstration
      let mockUser: User;
      
      if (email === 'admin@edusphere.com' && password === 'admin123') {
        mockUser = {
          id: '1',
          email,
          name: 'System Administrator',
          role: UserRole.ADMIN,
          avatar: 'https://ui-avatars.com/api/?name=System+Administrator'
        };
      } else if (email === 'teacher@edusphere.com' && password === 'teacher123') {
        mockUser = {
          id: '2',
          email,
          name: 'Room Administrator',
          role: UserRole.ROOM_ADMIN,
          avatar: 'https://ui-avatars.com/api/?name=Room+Administrator'
        };
      } else if (password === 'student123') {
        mockUser = {
          id: '3',
          email,
          name: 'Student User',
          role: UserRole.USER,
          avatar: 'https://ui-avatars.com/api/?name=Student+User'
        };
      } else {
        throw new Error('Invalid credentials');
      }

      // Store user data in localStorage for persistence
      localStorage.setItem('edusphere_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up new user with email, password, and name
   * @param email - User email address
   * @param password - User password
   * @param name - User full name
   * @param role - User role (defaults to USER)
   * @returns Promise<boolean> - Success status of signup attempt
   */
  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = UserRole.USER
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Basic password validation for demo (in production, this would be done server-side)
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Simulate API call - Replace with actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
      };

      // Store user data in localStorage for persistence
      localStorage.setItem('edusphere_user', JSON.stringify(newUser));
      setUser(newUser);
      
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
    setUser(null);
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
