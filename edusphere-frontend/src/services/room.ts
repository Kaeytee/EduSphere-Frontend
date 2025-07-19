/**
 * Room API service
 * Handles room operations, messaging, and room management
 */

import api, { handleApiError } from './api';
import type { Room, Message } from '../contexts/authTypes';
import type { AxiosError } from 'axios';

export interface CreateRoomData {
  name: string;
  description?: string;
  slug: string;
  creatorId: string;
}

export interface SendMessageData {
  content: string;
  userId: string;
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
  slug?: string;
}

export interface JoinRoomData {
  userId: string;
}

export interface JoinRoomResponse {
  message: string;
  room: Room;
}

export interface RoomStats {
  users: number;
  messages: number;
  media: number;
}

export interface RoomDetails extends Room {
  stats: RoomStats;
}

export class RoomService {
  /**
   * Get all rooms
   */
  static async getRooms(): Promise<Room[]> {
    try {
      const response = await api.get('/rooms');
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get room by ID
   */
  static async getRoom(roomId: string): Promise<RoomDetails> {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Create new room
   */
  static async createRoom(roomData: CreateRoomData): Promise<Room> {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Join room
   */
  static async joinRoom(roomId: string, data: JoinRoomData): Promise<JoinRoomResponse> {
    try {
      const response = await api.post(`/rooms/${roomId}/join`, data);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get room messages
   */
  static async getMessages(roomId: string, skip: number = 0, take: number = 50): Promise<Message[]> {
    try {
      const response = await api.get(`/rooms/${roomId}/messages?skip=${skip}&take=${take}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Send message to room
   */
  static async sendMessage(roomId: string, messageData: SendMessageData): Promise<Message> {
    try {
      const response = await api.post(`/rooms/${roomId}/messages`, messageData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Update room
   */
  static async updateRoom(roomId: string, roomData: UpdateRoomData): Promise<Room> {
    try {
      const response = await api.patch(`/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Delete room
   */
  static async deleteRoom(roomId: string): Promise<void> {
    try {
      await api.delete(`/rooms/${roomId}`);
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Get rooms by teacher/creator
   */
  static async getRoomsByTeacher(teacherId: string): Promise<Room[]> {
    try {
      const response = await api.get(`/rooms/teacher/${teacherId}`);
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }

  /**
   * Toggle room active status
   */
  static async toggleRoomStatus(roomId: string, isActive: boolean): Promise<Room> {
    try {
      const response = await api.patch(`/rooms/${roomId}/status`, { isActive });
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error as AxiosError);
    }
  }
}

export default RoomService;