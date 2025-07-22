/**
 * Authentication types and enums for the EduSphere application
 * Centralized type definitions for user roles and authentication-related interfaces
 */

/**
 * User role hierarchy for role-based access control (matching backend)
 * - ADMIN: Highest level access (platform administrator)
 * - TEACHER: Room moderator with limited admin rights
 * - STUDENT: Standard user access (student)
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Role mapping function to handle backend roles that don't match frontend roles
 * Maps backend role strings to frontend UserRole enum values
 */
export const mapBackendRoleToUserRole = (backendRole: string): UserRole => {
  switch (backendRole.toUpperCase()) {
    case 'ADMIN':
      return UserRole.ADMIN;
    case 'TEACHER':
      return UserRole.TEACHER;
    case 'STUDENT':
      return UserRole.STUDENT;
    case 'USER': // Map "User" to "STUDENT"
      return UserRole.STUDENT;
    default:
      console.warn(`Unknown role "${backendRole}" mapped to STUDENT`);
      return UserRole.STUDENT; // Default to STUDENT for unknown roles
  }
};

/**
 * User interface representing authenticated user data (matching backend)
 */
export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Role hierarchy mapping for role comparison
 * Higher numbers indicate higher privilege levels
 */
export const ROLE_HIERARCHY = {
  [UserRole.STUDENT]: 0,
  [UserRole.TEACHER]: 1,
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  [UserRole.STUDENT]: [Permission.READ],
  [UserRole.TEACHER]: [Permission.READ, Permission.WRITE],
  [UserRole.ADMIN]: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN]
} as const;

/**
 * Room interface representing discussion room data
 */
export interface Room {
  id: string;
  name: string;
  description?: string;
  slug: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  creator?: User;
  users?: User[];
  messages?: Message[];
  media?: Media[];
  userCount?: number;
  messageCount?: number;
  mediaCount?: number;
}

/**
 * Message interface representing chat message data
 */
export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  sent_at: string;
  deletedAt?: string;
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  // Optionally: deletedAt?: string;
}

/**
 * Media type enum
 */
export const MediaType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
} as const;

export type MediaType = typeof MediaType[keyof typeof MediaType];

/**
 * Media interface representing uploaded media data
 */
export interface Media {
  id: string;
  url: string;
  type: MediaType;
  userId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  room?: Room;
}

/**
 * AI Query interface representing AI assistant queries
 */
export interface AIQuery {
  id: string;
  query: string;
  response: Record<string, unknown>;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  user?: User;
}
