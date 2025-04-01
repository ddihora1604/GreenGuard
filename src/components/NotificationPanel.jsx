import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell, Trash2, XCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    clearNotification,
    clearAllNotifications
  } = useNotifications();

  // Compute notification stats for display
  const stats = useMemo(() => {
    const unread = notifications.filter(n => !n.isRead);
    const today = notifications.filter(n => {
      const date = new Date(n.timestamp);
      const now = new Date();
      return date.getDate() === now.getDate() && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    });
    
    return {
      total: notifications.length,
      unread: unread.length,
      today: today.length
    };
  }, [notifications]);

  const formatTime = (date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="fixed top-20 right-4 w-96 max-h-[70vh] bg-white rounded-xl shadow-xl z-[61] border border-emerald-100"
          >
            <div className="p-4 border-b border-emerald-100 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="font-semibold text-emerald-800">Notifications</h3>
                {unreadCount > 0 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-2 px-1.5 py-0.5 bg-emerald-100 rounded-full text-xs font-medium text-emerald-700"
                  >
                    {unreadCount} new
                  </motion.div>
                )}
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                    <span className="sr-only">Mark all as read</span>
                  </motion.button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-red-600"
                  title="Clear all notifications"
                >
                  <XCircle className="w-4 h-4" />
                  <span className="sr-only">Clear all</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(70vh-4rem)] scroll-smooth scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-emerald-600/60">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center px-4 py-2 bg-emerald-50/50 border-b border-emerald-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-emerald-700">
                        {stats.total} {stats.total === 1 ? 'notification' : 'notifications'}
                        {stats.unread > 0 && `, ${stats.unread} unread`}
                      </span>
                      {stats.today > 0 && (
                        <span className="text-xs text-emerald-600">
                          {stats.today} today
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-emerald-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-emerald-50/50 transition-colors relative ${
                          !notification.isRead ? 'bg-emerald-50/30' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                notification.type === 'success' ? 'bg-emerald-500' :
                                notification.type === 'error' ? 'bg-red-500' :
                                notification.type === 'warning' ? 'bg-amber-500' :
                                'bg-blue-500'
                              }`}></div>
                              <p className="text-sm text-emerald-800 font-medium">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="text-xs font-medium px-1.5 py-0.5 bg-emerald-100 rounded-full text-emerald-700">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-emerald-600 mt-1 ml-4">
                              {notification.message}
                            </p>
                            <p className="text-xs text-emerald-500 mt-2 ml-4">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {!notification.isRead && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

NotificationPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default NotificationPanel; 