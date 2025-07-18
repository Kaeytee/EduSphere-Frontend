/**
 * AI Assistant API service
 * Handles AI query processing and response management
 */

import api, { handleApiError } from './api';
import type { AIQuery } from '../contexts/authTypes';
import type { AxiosError } from 'axios';

export interface AIQueryData {
  userId: string;
  query: string;
}

export class AIService {
  /**
   * Submit AI query
   */
  static async submitQuery(queryData: AIQueryData): Promise<AIQuery> {
    try {
      const response = await api.post('/ai/query', queryData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get AI queries (all queries)
   */
  static async getQueries(skip: number = 0, take: number = 50): Promise<AIQuery[]> {
    try {
      const response = await api.get(`/ai/queries?skip=${skip}&take=${take}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get user's AI queries
   */
  static async getUserQueries(userId: string, skip: number = 0, take: number = 50): Promise<AIQuery[]> {
    try {
      const response = await api.get(`/ai/users/${userId}/queries?skip=${skip}&take=${take}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }
}

export default AIService;