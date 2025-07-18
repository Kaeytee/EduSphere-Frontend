import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import useAuth from "./useAuth";

/**
 * Notification priority levels for visual distinction
 */
export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export type NotificationPriority = typeof NotificationPriority[keyof typeof NotificationPriority];

/**
 * Notification type categories for different system events
 */
export const NotificationType = {
  SYSTEM: 'system',
  ASSIGNMENT: 'assignment',
  MESSAGE: 'message',
  ROOM_INVITE: 'room_invite',
  GRADE: 'grade',
  ANNOUNCEMENT: 'announcement'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

/**
 * Notification interface representing a single notification
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Notification context interface defining available methods and state
 */
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getUnreadNotifications: () => Notification[];
  addTestNotification: () => void;
}

/**
 * Notification context for managing notification state
 */
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Export the context for use in custom hook
export { NotificationContext };
export type { NotificationContextType };

/**
 * Notification provider component props
 */
interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Generate mock notifications based on user role for demonstration
 */
const generateMockNotifications = (userRole: string): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: '1',
      title: 'Welcome to EduSphere!',
      message: 'Complete your profile to get started with personalized learning experiences.',
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.MEDIUM,
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      actionUrl: '/app/profile'
    },
    {
      id: '2',
      title: 'New Course Available',
      message: 'Advanced React Development course is now available in your dashboard.',
      type: NotificationType.ANNOUNCEMENT,
      priority: NotificationPriority.LOW,
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      actionUrl: '/app/dashboard'
    }
  ];

  // Add role-specific notifications
  if (userRole === 'admin') {
    baseNotifications.push(
      {
        id: '3',
        title: 'System Maintenance Scheduled',
        message: 'Platform maintenance is scheduled for tonight at 11 PM EST.',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.HIGH,
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        actionUrl: '/app/admin/settings'
      },
      {
        id: '4',
        title: 'New User Registrations',
        message: '5 new users have registered in the last 24 hours.',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.MEDIUM,
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        actionUrl: '/app/admin/users'
      }
    );
  } else if (userRole === 'room_admin') {
    baseNotifications.push(
      {
        id: '5',
        title: 'Assignment Submissions',
        message: '3 students have submitted their assignments for review.',
        type: NotificationType.ASSIGNMENT,
        priority: NotificationPriority.MEDIUM,
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        actionUrl: '/app/manage/assignments'
      },
      {
        id: '6',
        title: 'Room Activity',
        message: 'High engagement in your React Fundamentals room today.',
        type: NotificationType.ROOM_INVITE,
        priority: NotificationPriority.LOW,
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
        actionUrl: '/app/manage/rooms'
      }
    );
  } else {
    baseNotifications.push(
      {
        id: '7',
        title: 'New Message',
        message: 'Your instructor has sent you a message about your recent assignment.',
        type: NotificationType.MESSAGE,
        priority: NotificationPriority.HIGH,
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        actionUrl: '/app/messages'
      },
      {
        id: '8',
        title: 'Room Invitation',
        message: 'You have been invited to join "Advanced JavaScript" study room.',
        type: NotificationType.ROOM_INVITE,
        priority: NotificationPriority.MEDIUM,
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        actionUrl: '/app/rooms'
      }
    );
  }

  return baseNotifications;
};

/**
 * Notification provider component that manages notification state
 * and provides notification methods to child components
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Initialize notifications when user changes or component mounts
   */
  useEffect(() => {
    const initializeNotifications = async (): Promise<void> => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (user) {
          const storageKey = `edusphere_notifications_${user.id}`;
          const savedNotifications = localStorage.getItem(storageKey);
          
          if (savedNotifications) {
            const parsedNotifications = JSON.parse(savedNotifications) as Notification[];
            // Convert date strings back to Date objects
            const notificationsWithDates = parsedNotifications.map(notification => ({
              ...notification,
              createdAt: new Date(notification.createdAt)
            }));
            setNotifications(notificationsWithDates);
          } else {
            // Generate mock notifications for new users
            const mockNotifications = generateMockNotifications(user.role);
            setNotifications(mockNotifications);
            localStorage.setItem(storageKey, JSON.stringify(mockNotifications));
          }
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, [user]);

  /**
   * Save notifications to localStorage whenever they change
   */
  useEffect(() => {
    if (user && notifications.length > 0) {
      const storageKey = `edusphere_notifications_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  /**
   * Add a new notification to the system
   * @param notification - Notification data without id, createdAt, and isRead
   */
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  /**
   * Mark a specific notification as read
   * @param notificationId - ID of the notification to mark as read
   */
  const markAsRead = (notificationId: string): void => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = (): void => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  /**
   * Delete a specific notification
   * @param notificationId - ID of the notification to delete
   */
  const deleteNotification = (notificationId: string): void => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  /**
   * Clear all notifications
   */
  const clearAllNotifications = (): void => {
    setNotifications([]);
  };

  /**
   * Get notifications by type
   * @param type - Notification type to filter by
   * @returns Array of notifications matching the type
   */
  const getNotificationsByType = (type: NotificationType): Notification[] => {
    return notifications.filter(notification => notification.type === type);
  };

  /**
   * Get unread notifications
   * @returns Array of unread notifications
   */
  const getUnreadNotifications = (): Notification[] => {
    return notifications.filter(notification => !notification.isRead);
  };

  /**
   * Add a test notification for demonstration purposes
   */
  const addTestNotification = (): void => {
    const testNotifications = [
      {
        title: 'New Message Received',
        message: 'You have a new message from your instructor about the upcoming assignment.',
        type: NotificationType.MESSAGE,
        priority: NotificationPriority.HIGH,
        actionUrl: '/app/messages'
      },
      {
        title: 'Assignment Due Soon',
        message: 'Your React Project assignment is due in 2 days.',
        type: NotificationType.ASSIGNMENT,
        priority: NotificationPriority.URGENT,
        actionUrl: '/app/assignments'
      },
      {
        title: 'New Course Available',
        message: 'Advanced TypeScript course has been added to your learning path.',
        type: NotificationType.ANNOUNCEMENT,
        priority: NotificationPriority.MEDIUM,
        actionUrl: '/app/courses'
      }
    ];

    const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
    addNotification(randomNotification);
  };

  /**
   * Calculate unread notification count
   */
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  /**
   * Context value object containing all notification state and methods
   */
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    addTestNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
