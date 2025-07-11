/**
 * Authentication types and enums for the EduSphere application
 * Centralized type definitions for user roles and authentication-related interfaces
 */

/**
 * User role hierarchy for role-based access control
 * - ADMIN: Highest level access (platform administrator)
 * - ROOM_ADMIN: Room management access (teacher/instructor)
 * - USER: Standard user access (student)
 */
export const UserRole = {
  ADMIN: 'admin',
  ROOM_ADMIN: 'room_admin',
  USER: 'user'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  isActive?: boolean;
}

/**
 * Role hierarchy mapping for role comparison
 * Higher numbers indicate higher privilege levels
 */
export const ROLE_HIERARCHY = {
  [UserRole.USER]: 0,
  [UserRole.ROOM_ADMIN]: 1,
  [UserRole.ADMIN]: 2
} as const;

/**
 * Authentication response interface for API calls
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

/**
 * Authentication error types
 */
export const AuthError = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  USER_NOT_FOUND: 'user_not_found',
  EMAIL_ALREADY_EXISTS: 'email_already_exists',
  WEAK_PASSWORD: 'weak_password',
  NETWORK_ERROR: 'network_error',
  UNAUTHORIZED: 'unauthorized',
  SESSION_EXPIRED: 'session_expired'
} as const;

export type AuthError = typeof AuthError[keyof typeof AuthError];

/**
 * Permission levels for different operations
 */
export const Permission = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS = {
  [UserRole.USER]: [Permission.READ],
  [UserRole.ROOM_ADMIN]: [Permission.READ, Permission.WRITE],
  [UserRole.ADMIN]: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN]
} as const;
