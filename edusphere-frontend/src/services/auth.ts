/**
 * Authentication API service
 * Handles user authentication, registration, and profile management
 */

import api, { handleApiError } from './api';
import type { User, LoginCredentials, RegistrationData } from '../contexts/authTypes';
import type { AxiosError } from 'axios';

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export class AuthService {
  /**
   * User login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempting login with: ${credentials.email} (attempt ${retryCount + 1})`);
        console.log('API Base URL:', api.defaults.baseURL);
        
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);
        return response.data;
      } catch (error: unknown) {
        console.error(`Login error details (attempt ${retryCount + 1}):`, error);
        
        // Log more details about the error
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError;
          console.error('Response status:', axiosError.response?.status);
          console.error('Response data:', axiosError.response?.data);
          console.error('Response headers:', axiosError.response?.headers);
        }
        
        // If it's a timeout and we have retries left, try again
        if (error instanceof Error && error.message.includes('timeout') && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Retrying login request (${retryCount}/${maxRetries - 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Progressive delay
          continue;
        }
        
        throw handleApiError(error as AxiosError);
      }
    }
    
    throw new Error('Login failed after all retries');
  }

  /**
   * User registration
   */
  static async register(userData: RegistrationData): Promise<SignupResponse> {
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