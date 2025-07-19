/**
 * API service configuration and axios instance
 * Handles authentication, request/response interceptors, and error handling
 */

import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://474t8p91-3000.uks1.devtunnels.ms/';
const API_TIMEOUT = 30000; // Increased to 30 seconds

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edusphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('edusphere_token');
      localStorage.removeItem('edusphere_user');
      // Don't redirect here - let the AuthContext handle it
      console.log('Token expired or invalid - clearing authentication');
    }
    return Promise.reject(error);
  }
);

// API Error interface
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

// Helper function to handle API errors
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response?.data) {
    return error.response.data as ApiError;
  }
  return {
    statusCode: error.response?.status || 500,
    message: error.message || 'Network error occurred',
    error: 'Unknown Error'
  };
};

export default api;