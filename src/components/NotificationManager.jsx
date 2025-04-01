import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

// Array of treatment tips
const treatmentTips = [
  {
    title: 'New Treatment Available',
    message: 'Updated organic treatment methods for leaf blight are now available.'
  },
  {
    title: 'Seasonal Treatment Reminder',
    message: 'Time to review your crop protection strategies for the upcoming season.'
  },
  {
    title: 'Treatment Best Practices',
    message: 'Learn about the latest eco-friendly pest control methods.'
  },
  {
    title: 'Treatment Schedule Update',
    message: 'Optimal timing for preventive treatments has been updated.'
  },
  {
    title: 'New Research Findings',
    message: 'Recent studies show improved efficacy of combined treatments.'
  }
];

// Array of farmer updates
const farmerUpdates = [
  {
    title: 'Farmer Community Update',
    message: 'New farming techniques being discussed in your local community.'
  },
  {
    title: 'Connect with Experts',
    message: 'Agricultural experts are available for consultation in your area.'
  },
  {
    title: 'Community Achievement',
    message: 'Local farmers reported increased yield using new methods.'
  },
  {
    title: 'Knowledge Sharing Session',
    message: 'Join the upcoming virtual meetup on sustainable farming.'
  },
  {
    title: 'Success Story',
    message: 'See how a local farmer overcame common crop challenges.'
  }
];

// Array of disease alerts
const diseaseAlerts = [
  {
    title: 'Disease Alert',
    message: 'Increased risk of fungal infections due to current weather conditions.'
  },
  {
    title: 'New Research Available',
    message: 'Latest findings on preventing common crop diseases added to the library.'
  },
  {
    title: 'Regional Disease Update',
    message: 'New disease patterns observed in neighboring farming areas.'
  },
  {
    title: 'Prevention Tips',
    message: 'Updated guidelines for protecting crops during high-risk periods.'
  },
  {
    title: 'Early Warning',
    message: 'Weather conditions favorable for disease development expected.'
  }
];

// Array of crop tips
const cropTips = [
  {
    title: 'Crop Rotation Tip',
    message: 'Consider rotating your crops to prevent soil depletion and reduce disease risk.'
  },
  {
    title: 'Water Conservation',
    message: 'Try drip irrigation to save water and reduce disease spread in your crops.'
  },
  {
    title: 'Soil Health Tip',
    message: 'Regular soil testing can help optimize your fertilization strategy.'
  },
  {
    title: 'Natural Pest Control',
    message: 'Companion planting can help reduce pest problems naturally.'
  },
  {
    title: 'Seasonal Planning',
    message: 'Now is the ideal time to plan your next season\'s crop rotation.'
  }
];

// Action-specific notification data
const actionNotifications = {
  image_upload: {
    title: 'Image Uploaded',
    message: 'Your image has been successfully uploaded and is being processed.',
    type: 'success'
  },
  generate_response: {
    title: 'Response Generated',
    message: 'Your disease analysis has been generated successfully.',
    type: 'success'
  },
  disease_suggestion: {
    title: 'Treatment Suggestion',
    message: 'Recommendations for your crop are now available.',
    type: 'info'
  },
  explore_library: {
    title: 'Crop Library',
    message: 'Explore our comprehensive library of crops and diseases.',
    type: 'info'
  },
  connect_farmers: {
    title: 'Farmer Community',
    message: 'Connect with your fellow farmers to share knowledge and experiences.',
    type: 'success'
  },
  photo_capture: {
    title: 'Photo Captured',
    message: 'Your photo has been captured and is being processed.',
    type: 'success'
  },
  recommendation: {
    title: 'New Recommendation',
    message: 'A new recommendation is available for your crops.',
    type: 'info'
  }
};

const NotificationManager = ({ triggerNotification }) => {
  const { addNotification, notifications } = useNotifications();
  const location = useLocation();

  // Function to create a notification for a specific action
  const createActionNotification = (action, data = {}) => {
    if (!actionNotifications[action]) {
      console.warn(`Unknown action type: ${action}`);
      return;
    }

    const notification = { ...actionNotifications[action] };
    
    // Handle disease-specific notifications
    if (action === 'disease_suggestion' && data.disease) {
      notification.message = `Recommendations for ${data.disease} are now available.`;
    }
    
    // Handle custom message notifications
    if (action === 'recommendation' && data.message) {
      notification.message = data.message;
    }
    
    addNotification(notification);
  };

  // Initialize random notifications
  useEffect(() => {
    // If there are too many unread notifications, don't add more
    if (notifications.filter(n => !n.isRead).length > 12) return;
    
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    
    const showRandomNotification = () => {
      const categories = [
        { items: treatmentTips, type: 'info', weight: 0.25 },
        { items: farmerUpdates, type: 'success', weight: 0.25 },
        { items: diseaseAlerts, type: 'warning', weight: 0.25 },
        { items: cropTips, type: 'info', weight: 0.25 }
      ];
      
      // Weighted random selection
      const random = Math.random();
      let weightSum = 0;
      const category = categories.find(cat => {
        weightSum += cat.weight;
        return random <= weightSum;
      }) || categories[0];
      
      const notification = getRandomItem(category.items);
      
      addNotification({
        ...notification,
        type: category.type,
        automated: true
      });
    };
    
    // Show first notification after 30 seconds
    const initialDelay = setTimeout(() => {
      showRandomNotification();
      
      // Show subsequent notifications at 2-3 minute intervals
      const interval = setInterval(() => {
        // Random interval between 2-3 minutes (in milliseconds)
        const randomInterval = Math.floor(Math.random() * (3 - 2 + 1) + 2) * 60 * 1000;
        setTimeout(showRandomNotification, randomInterval);
      }, 2 * 60 * 1000); // Check every 2 minutes
      
      return () => clearInterval(interval);
    }, 30 * 1000); 
    
    return () => clearTimeout(initialDelay);
  }, [addNotification, notifications]);
  
  // Handle route-based notifications
  useEffect(() => {
    if (location.pathname === '/connect-farmers') {
      createActionNotification('connect_farmers');
    } else if (location.pathname === '/crops-diseases') {
      createActionNotification('explore_library');
    }
  }, [location.pathname]);
  
  // Listen for notification trigger events
  useEffect(() => {
    if (triggerNotification) {
      const { action, data } = triggerNotification;
      createActionNotification(action, data);
    }
  }, [triggerNotification]);
  
  // This component doesn't render anything
  return null;
};

NotificationManager.propTypes = {
  triggerNotification: PropTypes.shape({
    action: PropTypes.string.isRequired,
    data: PropTypes.object
  })
};

export default NotificationManager;

// Export the action types for easy reference
export const NotificationActions = Object.keys(actionNotifications).reduce((acc, key) => {
  acc[key.toUpperCase()] = key;
  return acc;
}, {}); 