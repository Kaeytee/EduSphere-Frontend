/**
 * Media API service
 * Handles media upload and retrieval
 */

import api, { handleApiError } from './api';
import type { Media, MediaType } from '../contexts/authTypes';
import type { AxiosError } from 'axios';

export interface MediaUploadData {
  url: string;
  type: MediaType;
  userId: string;
  roomId: string;
}

export class MediaService {
  /**
   * Upload media
   */
  static async uploadMedia(mediaData: MediaUploadData): Promise<Media> {
    try {
      const response = await api.post('/media', mediaData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get room media
   */
  static async getRoomMedia(roomId: string, skip: number = 0, take: number = 50): Promise<Media[]> {
    try {
      const response = await api.get(`/media/room/${roomId}?skip=${skip}&take=${take}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }
}

export default MediaService;