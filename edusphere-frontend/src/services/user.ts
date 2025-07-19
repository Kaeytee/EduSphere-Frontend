/**
 * User management API service
 * Handles user CRUD operations and admin functionality
 */

import { api } from './api';
import type { User, UserRole } from '../contexts/authTypes';
import type { AxiosError } from 'axios';

/**
 * Extended user interface for admin operations
 */
export interface AdminUser extends User {
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  emailVerified: boolean;
  enrolledRooms?: number;
  totalSessions?: number;
  totalPoints?: number;
}

/**
 * User statistics interface
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  adminUsers: number;
  teacherUsers: number;
  studentUsers: number;
}

/**
 * User creation data interface
 */
export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

/**
 * User update data interface
 */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'suspended';
}

/**
 * Error handler for API calls
 */
const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    const errorData = error.response.data as { message?: string };
    const message = errorData?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Network error - please check your connection');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export class UserService {
  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get user statistics (admin only)
   */
  static async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get('/admin/users/stats');
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Create new user (admin only)
   */
  static async createUser(userData: CreateUserData): Promise<AdminUser> {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Update user (admin only)
   */
  static async updateUser(userId: string, userData: UpdateUserData): Promise<AdminUser> {
    try {
      const response = await api.patch(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Update user status (admin only)
   */
  static async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<AdminUser> {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get user by ID (admin only)
   */
  static async getUserById(userId: string): Promise<AdminUser> {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Search users (admin only)
   */
  static async searchUsers(params: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get('/admin/users/search', { params });
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }
}
