import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const ActionNotificationContext = createContext();

export const useActionNotifications = () => {
  const context = useContext(ActionNotificationContext);
  if (!context) {
    throw new Error('useActionNotifications must be used within an ActionNotificationProvider');
  }
  return context;
};

export const ActionNotificationProvider = ({ children }) => {
  const [actionNotification, setActionNotification] = useState(null);

  const showActionNotification = useCallback((message, type = 'info', duration = 3000) => {
    setActionNotification({
      message,
      type,
      id: Date.now(),
    });

    // Auto-hide the notification after duration
    setTimeout(() => {
      setActionNotification(null);
    }, duration);
  }, []);

  const hideActionNotification = useCallback(() => {
    setActionNotification(null);
  }, []);

  const value = {
    actionNotification,
    showActionNotification,
    hideActionNotification,
  };

  return (
    <ActionNotificationContext.Provider value={value}>
      {children}
    </ActionNotificationContext.Provider>
  );
};

ActionNotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 