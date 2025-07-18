/**
 * WebSocket service for real-time communication
 * Handles Socket.IO connection and event management
 */

import { io, Socket } from 'socket.io-client';
import type { User } from '../contexts/authTypes';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001';

export interface SocketMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  user: User;
  sent_at: string;
}

export interface JoinRoomData {
  room_id: string;
  user_id: string;
}

export interface LeaveRoomData {
  room_id: string;
  user_id: string;
}

export interface SendMessageData {
  room_id: string;
  user_id: string;
  content: string;
}

export interface TypingData {
  room_id: string;
  user_id: string;
  is_typing: boolean;
}

export interface GetRoomInfoData {
  room_id: string;
}

export interface UserJoinedData {
  user_id: string;
  username: string;
  message: string;
}

export interface UserLeftData {
  user_id: string;
  username: string;
  message: string;
}

export interface UserTypingData {
  user_id: string;
  username: string;
  is_typing: boolean;
}

export interface RoomInfoData {
  room: {
    id: string;
    name: string;
    description?: string;
    creator: User;
    userCount: number;
    messageCount: number;
  };
}

export interface SocketError {
  message: string;
}

export class SocketService {
  private socket: Socket | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        this.socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Disconnected from WebSocket server:', reason);
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log(`Reconnected to WebSocket server (attempt ${attemptNumber})`);
        });

        this.socket.on('reconnect_error', (error) => {
          console.error('WebSocket reconnection error:', error);
        });

        this.socket.on('reconnect_failed', () => {
          console.error('WebSocket reconnection failed');
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a room
   */
  joinRoom(data: JoinRoomData): void {
    if (this.socket) {
      this.socket.emit('join-room', data);
    }
  }

  /**
   * Leave a room
   */
  leaveRoom(data: LeaveRoomData): void {
    if (this.socket) {
      this.socket.emit('leave-room', data);
    }
  }

  /**
   * Send message
   */
  sendMessage(data: SendMessageData): void {
    if (this.socket) {
      this.socket.emit('send-message', data);
    }
  }

  /**
   * Send typing indicator
   */
  sendTyping(data: TypingData): void {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }

  /**
   * Get room info
   */
  getRoomInfo(data: GetRoomInfoData): void {
    if (this.socket) {
      this.socket.emit('get-room-info', data);
    }
  }

  /**
   * Listen for room joined event
   */
  onJoinedRoom(callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on('joined-room', callback);
    }
  }

  /**
   * Listen for user joined event
   */
  onUserJoined(callback: (data: UserJoinedData) => void): void {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  /**
   * Listen for user left event
   */
  onUserLeft(callback: (data: UserLeftData) => void): void {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  /**
   * Listen for new message event
   */
  onNewMessage(callback: (data: SocketMessage) => void): void {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  /**
   * Listen for user typing event
   */
  onUserTyping(callback: (data: UserTypingData) => void): void {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  /**
   * Listen for room info event
   */
  onRoomInfo(callback: (data: RoomInfoData) => void): void {
    if (this.socket) {
      this.socket.on('room-info', callback);
    }
  }

  /**
   * Listen for error event
   */
  onError(callback: (data: SocketError) => void): void {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  /**
   * Remove event listeners
   */
  off(event: string, callback?: ((...args: unknown[]) => void) | undefined): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;