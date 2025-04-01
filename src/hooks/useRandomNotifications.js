import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

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

// Additional crop tips for more variety
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

export const useRandomNotifications = () => {
  const { addNotification, notifications } = useNotifications();

  useEffect(() => {
    // Increase threshold for unread notifications
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
    }, 30 * 1000); // Show first notification after 30 seconds

    return () => clearTimeout(initialDelay);
  }, [addNotification, notifications]);
}; 