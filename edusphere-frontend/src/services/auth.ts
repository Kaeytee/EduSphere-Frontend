/**
 * Authentication API service
 * Handles user authentication, registration, and profile management
 */

import api, { handleApiError } from './api';
import type { User, LoginCredentials, RegistrationData } from '../contexts/authTypes';
import type { AxiosError } from 'axios';

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  /**
   * User login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * User registration
   */
  static async register(userData: RegistrationData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get user details
   */
  static async getUser(userId: string): Promise<User> {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get public user profile
   */
  static async getPublicProfile(userId: string): Promise<User> {
    try {
      const response = await api.get(`/users/${userId}/public`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }
}

export default AuthService;