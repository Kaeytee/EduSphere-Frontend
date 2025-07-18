/**
 * Notification hook
 * Custom hook to access notification context
 */

import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import type { NotificationContextType } from './NotificationContext';

/**
 * Hook to access notification context
 * @throws Error if used outside of NotificationProvider
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default useNotifications;