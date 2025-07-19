/**
 * Room API Integration Test Utilities
 * Use these functions to test the room API integration
 */

import { RoomService } from '../services/room';
import type { Room } from '../contexts/authTypes';

export class RoomApiTest {
  /**
   * Test fetching all rooms
   */
  static async testGetRooms(): Promise<Room[]> {
    try {
      console.log('Testing getRooms...');
      const rooms = await RoomService.getRooms();
      console.log('✅ getRooms successful:', rooms);
      return rooms;
    } catch (error) {
      console.error('❌ getRooms failed:', error);
      throw error;
    }
  }

  /**
   * Test creating a new room
   */
  static async testCreateRoom(creatorId: string): Promise<Room> {
    try {
      console.log('Testing createRoom...');
      const roomData = {
        name: 'Test Room ' + Date.now(),
        description: 'This is a test room created by API integration test',
        slug: 'test-room-' + Date.now(),
        creatorId
      };
      
      const room = await RoomService.createRoom(roomData);
      console.log('✅ createRoom successful:', room);
      return room;
    } catch (error) {
      console.error('❌ createRoom failed:', error);
      throw error;
    }
  }

  /**
   * Test getting a specific room by ID
   */
  static async testGetRoom(roomId: string): Promise<Room> {
    try {
      console.log('Testing getRoom...');
      const room = await RoomService.getRoom(roomId);
      console.log('✅ getRoom successful:', room);
      return room;
    } catch (error) {
      console.error('❌ getRoom failed:', error);
      throw error;
    }
  }

  /**
   * Test updating a room
   */
  static async testUpdateRoom(roomId: string): Promise<Room> {
    try {
      console.log('Testing updateRoom...');
      const updateData = {
        name: 'Updated Test Room ' + Date.now(),
        description: 'This room has been updated by API integration test',
        slug: 'updated-test-room-' + Date.now()
      };
      
      const room = await RoomService.updateRoom(roomId, updateData);
      console.log('✅ updateRoom successful:', room);
      return room;
    } catch (error) {
      console.error('❌ updateRoom failed:', error);
      throw error;
    }
  }

  /**
   * Test joining a room
   */
  static async testJoinRoom(roomId: string, userId: string): Promise<void> {
    try {
      console.log('Testing joinRoom...');
      const result = await RoomService.joinRoom(roomId, { userId });
      console.log('✅ joinRoom successful:', result);
    } catch (error) {
      console.error('❌ joinRoom failed:', error);
      throw error;
    }
  }

  /**
   * Test deleting a room
   */
  static async testDeleteRoom(roomId: string): Promise<void> {
    try {
      console.log('Testing deleteRoom...');
      await RoomService.deleteRoom(roomId);
      console.log('✅ deleteRoom successful');
    } catch (error) {
      console.error('❌ deleteRoom failed:', error);
      throw error;
    }
  }

  /**
   * Test getting rooms by teacher
   */
  static async testGetRoomsByTeacher(teacherId: string): Promise<Room[]> {
    try {
      console.log('Testing getRoomsByTeacher...');
      const rooms = await RoomService.getRoomsByTeacher(teacherId);
      console.log('✅ getRoomsByTeacher successful:', rooms);
      return rooms;
    } catch (error) {
      console.error('❌ getRoomsByTeacher failed:', error);
      throw error;
    }
  }

  /**
   * Test toggling room status
   */
  static async testToggleRoomStatus(roomId: string, isActive: boolean): Promise<Room> {
    try {
      console.log('Testing toggleRoomStatus...');
      const room = await RoomService.toggleRoomStatus(roomId, isActive);
      console.log('✅ toggleRoomStatus successful:', room);
      return room;
    } catch (error) {
      console.error('❌ toggleRoomStatus failed:', error);
      throw error;
    }
  }

  /**
   * Run all room API tests
   */
  static async runAllTests(userId: string): Promise<void> {
    console.log('🧪 Starting Room API Integration Tests...');
    
    try {
      // Test 1: Get all rooms
      await this.testGetRooms();
      
      // Test 2: Create a room
      const createdRoom = await this.testCreateRoom(userId);
      
      // Test 3: Get the created room
      await this.testGetRoom(createdRoom.id);
      
      // Test 4: Update the room
      await this.testUpdateRoom(createdRoom.id);
      
      // Test 5: Join the room
      await this.testJoinRoom(createdRoom.id, userId);
      
      // Test 6: Toggle room status
      await this.testToggleRoomStatus(createdRoom.id, false);
      
      // Test 7: Get rooms by teacher
      await this.testGetRoomsByTeacher(userId);
      
      // Test 8: Delete the room (cleanup)
      await this.testDeleteRoom(createdRoom.id);
      
      console.log('🎉 All Room API tests completed successfully!');
      
    } catch (error) {
      console.error('💥 Room API test suite failed:', error);
      throw error;
    }
  }
}

// Browser console helper functions
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).testRoomApi = RoomApiTest;
  console.log('🚀 Room API test utilities loaded! Use testRoomApi.runAllTests(userId) to run tests.');
}

export default RoomApiTest;
