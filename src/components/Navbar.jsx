import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mic } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotificationPanel from './NotificationPanel';
import { useNotifications } from '../context/NotificationContext';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ isCollapsed }) => {
  const location = useLocation();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = React.useState(false);
  const { unreadCount } = useNotifications();

  // Format the notification count for display
  const formatNotificationCount = (count) => {
    if (count > 99) return '99+';
    return count.toString();
  };

  // Function to get the current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Crop Disease Detection';
      case '/detection-history':
        return 'Detection History';
      case '/fertilizers':
        return 'Treatment Recommendations';
      case '/connect-farmers':
        return 'Farmer Community';
      case '/connect-team':
        return 'Team Collaboration';
      case '/crops-diseases':
        return 'Crops and Diseases Library';
      default:
        return 'GreenGuard Chatbot';
    }
  };

  // Function to get subtitle if needed
  const getPageSubtitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Detect and Diagnose Crop Diseases';
      case '/detection-history':
        return 'View Past Crop Disease Detections';
      case '/fertilizers':
        return 'Get Expert Advice on Disease Treatments';
      case '/connect-farmers':
        return 'Connect with your Fellow Farmers';
      case '/connect-team':
        return 'Collaborate with Our GreenGuard Team';
      case '/crops-diseases':
        return 'Comprehensive Guide to Crop Diseases';
      default:
        return '';
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50"
    >
      {/* Simplified gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-green-50/95 to-white/90 transition-colors duration-300" />
      <div className="absolute inset-0 backdrop-blur-md" />
      
      {/* Decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-200/50 to-transparent" />
      
      <div className="relative h-20">
        <div className={`h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
          {/* Title section */}
          <motion.div className="flex-1 flex flex-col justify-center">
            <div className="relative group">
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 scale-110 ${
                'bg-gradient-to-r from-green-200/0 via-green-200/20 to-green-200/0'
              }`} />
              
              {/* Main title */}
              <motion.div layout className="relative z-10 py-1">
                <motion.h1
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-2xl font-bold transform-gpu"
                >
                  <span className={`inline-block group-hover:scale-[1.02] transition-all duration-300 ease-out ${
                    'bg-gradient-to-r from-green-800 via-green-700 to-green-800 bg-clip-text text-transparent'
                  }`}>
                    {getPageTitle()}
                  </span>
                </motion.h1>

                {/* Subtitle with theme-aware colors */}
                {getPageSubtitle() && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className={`text-sm mt-0.5 transform-gpu transition-colors duration-300 ${
                      'text-green-700/80 group-hover:text-green-800'
                    }`}
                  >
                    {getPageSubtitle()}
                  </motion.p>
                )}
              </motion.div>

              {/* Decorative underline */}
              <div className={`absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                'bg-gradient-to-r from-transparent via-green-300/30 to-transparent'
              }`} />
            </div>
          </motion.div>

          {/* Language selector, Microphone, and Notification buttons */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Microphone button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button 
                className="p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg bg-white hover:bg-green-50 border-green-200 border"
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5 text-green-700" />
              </button>
            </motion.div>

            {/* Notification button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button 
                onClick={() => setIsNotificationsPanelOpen(true)}
                className="p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg bg-white hover:bg-green-50 border-green-200 border"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-5 w-5 text-green-700" />
                <AnimatePresence mode="wait">
                  {unreadCount > 0 && (
                    <motion.div
                      key={unreadCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className="absolute -top-0.5 -right-0.5 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75 h-4 w-4" style={{ animationDuration: '2s' }}></div>
                      <div className="relative z-10 h-4 min-w-4 px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-medium">
                        {formatNotificationCount(unreadCount)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <NotificationPanel 
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />
    </motion.nav>
  );
};

Navbar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired
};

export default Navbar;
