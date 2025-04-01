import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unreadCount whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    // Validate notification type
    const validTypes = ['success', 'error', 'warning', 'info'];
    if (!validTypes.includes(notification.type)) {
      console.warn('Invalid notification type');
      notification.type = 'info';
    }

    // Ensure required fields
    if (!notification.title || !notification.message) {
      console.warn('Notification missing required fields');
      return;
    }

    // Check if there are too many recent notifications
    setNotifications(prev => {
      const recentNotifications = prev.filter(
        n => (Date.now() - n.timestamp) < 5 * 60 * 1000 // last 5 minutes
      );

      // If there are more than 3 recent notifications, don't add new automated ones
      if (recentNotifications.length > 3 && notification.automated) {
        return prev;
      }

      const newNotification = {
        id: Date.now(),
        timestamp: new Date(),
        isRead: false,
        ...notification,
        // Theme-aware icon colors
        iconClass: notification.type === 'success' ? 'text-emerald-500 dark:text-emerald-400' :
                  notification.type === 'error' ? 'text-red-500 dark:text-red-400' :
                  notification.type === 'warning' ? 'text-amber-500 dark:text-amber-400' :
                  'text-blue-500 dark:text-blue-400'
      };

      // Prevent duplicate notifications within 5 seconds
      const recentDuplicate = prev[0]?.message === notification.message && 
        (Date.now() - prev[0]?.timestamp) < 5000;
      
      if (recentDuplicate) return prev;
      
      return [newNotification, ...prev].slice(0, 50);
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 