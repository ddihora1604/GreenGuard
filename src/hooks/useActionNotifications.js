import { useNotifications } from '../context/NotificationContext';

// This hook monitors specific actions and triggers notifications accordingly
export const useActionNotifications = () => {
  const { addNotification } = useNotifications();

  // Function to create action-specific notifications
  const createActionNotification = (action, data = {}) => {
    switch (action) {
      case 'image_upload':
        addNotification({
          title: 'Image Uploaded',
          message: 'Your image has been successfully uploaded and is being processed.',
          type: 'success'
        });
        break;
        
      case 'generate_response':
        addNotification({
          title: 'Response Generated',
          message: 'Your disease analysis has been generated successfully.',
          type: 'success'
        });
        break;
        
      case 'disease_suggestion':
        addNotification({
          title: 'Treatment Suggestion',
          message: `Recommendations for ${data.disease || 'your crop'} are now available.`,
          type: 'info'
        });
        break;
        
      case 'explore_library':
        addNotification({
          title: 'Crop Library',
          message: 'Explore our comprehensive library of crops and diseases.',
          type: 'info'
        });
        break;
        
      case 'connect_farmers':
        addNotification({
          title: 'Farmer Community',
          message: 'Connect with your fellow farmers to share knowledge and experiences.',
          type: 'success'
        });
        break;
        
      case 'photo_capture':
        addNotification({
          title: 'Photo Captured',
          message: 'Your photo has been captured and is being processed.',
          type: 'success'
        });
        break;
        
      case 'recommendation':
        addNotification({
          title: 'New Recommendation',
          message: data.message || 'A new recommendation is available for your crops.',
          type: 'info'
        });
        break;
        
      default:
        console.warn(`Unknown action type: ${action}`);
    }
  };
  
  return { createActionNotification };
}; 