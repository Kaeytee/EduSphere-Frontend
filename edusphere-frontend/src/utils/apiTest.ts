/**
 * Test utilities for API integration
 * Use these functions to test your API endpoints
 */

import { UserService } from '../services/user';

/**
 * Test all user API endpoints
 * Run this function to verify your API is working correctly
 */
export const testUserAPI = async () => {
  console.log('🚀 Testing User API endpoints...');
  
  try {
    // Test getting all users
    console.log('📋 Testing getAllUsers...');
    const users = await UserService.getAllUsers();
    console.log('✅ getAllUsers successful:', users.length, 'users found');
    
    // Test getting user stats
    console.log('📊 Testing getUserStats...');
    const stats = await UserService.getUserStats();
    console.log('✅ getUserStats successful:', stats);
    
    // Test search users
    console.log('🔍 Testing searchUsers...');
    const searchResults = await UserService.searchUsers({
      search: 'test',
      page: 1,
      limit: 10
    });
    console.log('✅ searchUsers successful:', searchResults.users.length, 'results found');
    
    console.log('🎉 All API tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.log('💡 Make sure your backend is running and the API endpoints are implemented');
    return false;
  }
};

/**
 * Test creating a new user
 * @param userData - User data to create
 */
export const testCreateUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}) => {
  console.log('👤 Testing createUser...');
  
  try {
    const newUser = await UserService.createUser(userData);
    console.log('✅ createUser successful:', newUser);
    return newUser;
  } catch (error) {
    console.error('❌ createUser failed:', error);
    throw error;
  }
};

/**
 * Test updating user status
 * @param userId - User ID to update
 * @param status - New status
 */
export const testUpdateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
  console.log('🔄 Testing updateUserStatus...');
  
  try {
    const updatedUser = await UserService.updateUserStatus(userId, status);
    console.log('✅ updateUserStatus successful:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('❌ updateUserStatus failed:', error);
    throw error;
  }
};

/**
 * API endpoint expectations
 * Your backend should implement these endpoints:
 */
export const API_ENDPOINTS = {
  getAllUsers: 'GET /admin/users',
  getUserStats: 'GET /admin/users/stats',
  createUser: 'POST /admin/users',
  updateUser: 'PATCH /admin/users/:id',
  deleteUser: 'DELETE /admin/users/:id',
  updateUserStatus: 'PATCH /admin/users/:id/status',
  getUserById: 'GET /admin/users/:id',
  searchUsers: 'GET /admin/users/search'
};

/**
 * Expected API response formats
 */
export const API_RESPONSE_FORMATS = {
  user: {
    id: 'number',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    role: 'ADMIN | TEACHER | STUDENT',
    status: 'active | inactive | suspended',
    emailVerified: 'boolean',
    createdAt: 'ISO string',
    updatedAt: 'ISO string',
    lastLogin: 'ISO string (optional)',
    avatar: 'string (optional)',
    enrolledRooms: 'number (optional)',
    totalSessions: 'number (optional)',
    totalPoints: 'number (optional)'
  },
  stats: {
    totalUsers: 'number',
    activeUsers: 'number',
    newUsersThisMonth: 'number',
    adminUsers: 'number',
    teacherUsers: 'number',
    studentUsers: 'number'
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).testUserAPI = testUserAPI;
  (window as unknown as Record<string, unknown>).testCreateUser = testCreateUser;
  (window as unknown as Record<string, unknown>).testUpdateUserStatus = testUpdateUserStatus;
}
