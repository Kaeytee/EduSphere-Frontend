import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, NotificationPriority, NotificationType } from '../contexts/NotificationContext';
import type { Notification } from '../contexts/NotificationContext';

/**
 * Notification dropdown component props
 */
interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Format relative time for notification display
 * @param date - Date to format
 * @returns Formatted relative time string
 */
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

/**
 * Get priority color classes for notification styling
 * @param priority - Notification priority level
 * @returns CSS classes for priority indication
 */
const getPriorityColor = (priority: NotificationPriority): string => {
  switch (priority) {
    case NotificationPriority.URGENT:
      return 'border-l-red-500 bg-red-50';
    case NotificationPriority.HIGH:
      return 'border-l-orange-500 bg-orange-50';
    case NotificationPriority.MEDIUM:
      return 'border-l-primary-500 bg-primary-50';
    case NotificationPriority.LOW:
    default:
      return 'border-l-gray-500 bg-gray-50';
  }
};

/**
 * Get notification type icon
 * @param type - Notification type
 * @returns JSX element for notification icon
 */
const getNotificationIcon = (type: NotificationType): React.ReactElement => {
  const iconClasses = "w-5 h-5";
  
  switch (type) {
    case NotificationType.SYSTEM:
      return (
        <svg className={`${iconClasses} text-primary-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case NotificationType.ASSIGNMENT:
      return (
        <svg className={`${iconClasses} text-primary-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case NotificationType.MESSAGE:
      return (
        <svg className={`${iconClasses} text-purple-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case NotificationType.ROOM_INVITE:
      return (
        <svg className={`${iconClasses} text-indigo-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case NotificationType.GRADE:
      return (
        <svg className={`${iconClasses} text-yellow-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case NotificationType.ANNOUNCEMENT:
    default:
      return (
        <svg className={`${iconClasses} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
  }
};

/**
 * Notification dropdown component that displays notifications in a dropdown menu
 * Features comprehensive notification management with read/unread states, actions, and filtering
 */
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  /**
   * Handle notification click - mark as read and navigate if action URL exists
   * @param notification - Notification object to handle
   */
  const handleNotificationClick = (notification: Notification): void => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  /**
   * Handle notification deletion with confirmation
   * @param e - Click event to prevent propagation
   * @param notificationId - ID of notification to delete
   */
  const handleDelete = (e: React.MouseEvent, notificationId: string): void => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  /**
   * Handle clear all notifications with confirmation
   */
  const handleClearAll = (): void => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearAllNotifications();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden transform -translate-x-4 sm:translate-x-0 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Notifications</h3>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {notifications.some((n: Notification) => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className="text-xs sm:text-sm text-primary-600 hover:text-primary-800 font-medium whitespace-nowrap"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-3 sm:px-4 py-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="mt-2 text-sm">No notifications yet</p>
            <p className="text-xs text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-3 sm:px-4 py-3 border-l-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                  !notification.isRead ? 'bg-primary-50' : 'bg-white'
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 pt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''} truncate pr-2`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="ml-2 w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="ml-1 sm:ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                    title="Delete notification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
