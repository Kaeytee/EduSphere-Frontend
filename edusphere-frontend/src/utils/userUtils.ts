/**
 * Utility functions for user data
 */

import type { User } from '../contexts/authTypes';

/**
 * Get user's display name from user object
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'User';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.firstName) {
    return user.firstName;
  }
  
  if (user.email) {
    return user.email;
  }
  
  return 'User';
};

/**
 * Get user's initials from user object
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return 'U';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

/**
 * Get user's first name from user object
 */
export const getUserFirstName = (user: User | null): string => {
  if (!user) return 'User';
  
  if (user.firstName) {
    return user.firstName;
  }
  
  if (user.email) {
    return user.email;
  }
  
  return 'User';
};