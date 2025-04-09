import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ImageUploadButtons from './components/ImageUploadButtons';
import Camera from './components/Camera';
import DecorativeBackground from './components/DecorativeBackground';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AppProvider, useApp } from './context/AppContext';
import './App.css';
import DetectionHistoryPage from './pages/DetectionHistoryPage';
import ConnectFarmersPage from './pages/ConnectFarmersPage';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import NotificationManager, { NotificationActions } from './components/NotificationManager';
import { useRandomNotifications } from './hooks/useRandomNotifications';
import { useActionNotifications } from './hooks/useActionNotifications';
import { MessageSquare, BarChart2 } from 'lucide-react';
import TeamPage from './pages/TeamPage';

const DashboardPage = ({ handleImageProcess, isCollapsed }) => {
  const {
    messages,
    imageDetected,
    setShowCamera,
    isLoading,
    addMessage,
    resetState,
    setImageDetected,
    setIsLoading,
    removeTypingMessages
  } = useApp();
  const { addNotification } = useNotifications();
  const { createActionNotification } = useActionNotifications();
  const [notificationTrigger, setNotificationTrigger] = useState(null);
  const navigate = useNavigate();

  // Function to trigger notifications
  const triggerNotification = (action, data = {}) => {
    setNotificationTrigger({ action, data });
  };

  // Reset notification trigger after it's processed
  useEffect(() => {
    if (notificationTrigger) {
      const timer = setTimeout(() => {
        setNotificationTrigger(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [notificationTrigger]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      addMessage({
        type: 'bot',
        content: 'Please upload a valid image file (JPG or PNG).',
        status: 'error'
      });
      return;
    }

    try {
      setIsLoading(true);
      setImageDetected(true);

      // Trigger notification for image upload
      triggerNotification(NotificationActions.IMAGE_UPLOAD);

      // Add user message with image
      addMessage({
        type: 'user',
        // content: 'I need help identifying this plant disease.',
        image: URL.createObjectURL(file),
        timestamp: new Date()
      });

      // Navigate to chatbot page instead of staying on dashboard
      navigate('/chatbot');

      // Add typing indicator
      addMessage({
        type: 'bot',
        content: 'Analyzing image...',
        status: 'typing'
      });

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        removeTypingMessages();
        addMessage({
          type: 'bot',
          content: `Disease detected: ${response.data.disease}\n\n${response.data.explanation}`,
          timestamp: new Date()
        });

        const historyEntry = {
          timestamp: Date.now(),
          image: URL.createObjectURL(file),
          detection: response.data.disease,
          treatment: response.data.treatment,
          chatHistory: messages
        };

        const existingHistory = JSON.parse(sessionStorage.getItem('detectionHistory') || '[]');
        sessionStorage.setItem('detectionHistory', JSON.stringify([...existingHistory, historyEntry]));

        addNotification({
          title: 'Disease Detection Complete',
          message: 'Your crop image has been successfully analyzed.',
          type: 'success'
        });

        // Trigger notification for response generation
        triggerNotification(NotificationActions.GENERATE_RESPONSE);

        // If disease was detected, trigger suggestion notification with delay
        if (response.data.disease) {
          setTimeout(() => {
            triggerNotification(NotificationActions.DISEASE_SUGGESTION, { 
              disease: response.data.disease 
            });
          }, 3000);
        }
      } else {
        throw new Error(response.data.error || 'Failed to analyze image');
      }
    } catch (error) {
      removeTypingMessages();
      addMessage({
        type: 'bot',
        content: error.response?.data?.error || error.message || 'Failed to process the image. Please try again.',
        status: 'error'
      });

      addNotification({
        title: 'Detection Failed',
        message: error.message || 'Failed to process the image. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NotificationManager triggerNotification={notificationTrigger} />
      <div className={`main-content-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <DecorativeBackground className="fixed inset-0 z-0" />

        {!imageDetected ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 px-6 py-8"
          >
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto mb-1 text-center"
            >
             
            </motion.div>

            {/* Main Content Grid */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Upload Image Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="h-[300px] backdrop-blur-sm bg-white/90 p-8 rounded-3xl shadow-lg border-2 border-dashed border-emerald-200 group-hover:border-emerald-400 transition-all duration-300">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="upload-input"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                  <label 
                    htmlFor="upload-input"
                    className="h-full cursor-pointer flex flex-col items-center justify-center gap-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <svg 
                        className="w-16 h-16 text-emerald-600 relative z-10" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-semibold text-emerald-800">
                        Upload Image
                      </h3>
                      <p className="text-emerald-600 text-lg">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-emerald-500/80 text-sm">
                        Supports: JPG, PNG (max 5MB)
                      </p>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 text-sm text-emerald-600/80 bg-emerald-50/50 px-4 py-2 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Make sure the leaf is clearly visible</span>
                    </motion.div>
                  </label>
                </div>
              </motion.div>

              {/* Take Photo Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <button
                  onClick={() => setShowCamera(true)}
                  disabled={isLoading}
                  className="h-[300px] w-full backdrop-blur-sm bg-white/90 p-8 rounded-3xl shadow-lg 
                           border-2 border-dashed border-emerald-200 group-hover:border-emerald-400 
                           transition-all duration-300 flex flex-col items-center justify-center gap-6
                           group-hover:shadow-xl group-hover:scale-[1.01]"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                    <svg 
                      className="w-16 h-16 text-emerald-600 relative z-10" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-semibold text-emerald-800">
                      Take Photo
                    </h3>
                    <p className="text-emerald-600 text-lg">
                      Use your device's camera
                    </p>
                    <p className="text-emerald-500/80 text-sm">
                      Position the leaf in good lighting
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 text-sm text-emerald-600/80 bg-emerald-50/50 px-4 py-2 rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Center the leaf in the frame</span>
                  </motion.div>
                </button>
              </motion.div>
            </div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-30/80 to-emerald-100/50 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-emerald-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tips for Better Detection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                    text: "Ensure good lighting and clear focus on the affected area"
                  },
                  {
                    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                    text: "Include both healthy and affected parts of the leaf"
                  },
                  {
                    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                    text: "Avoid shadows and reflections on the leaf surface"
                  }
                ].map((tip, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 p-4 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tip.icon} />
                        </svg>
                      </div>
                      <p className="text-emerald-700">{tip.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="chat-container backdrop-blur-md p-6 rounded-2xl border border-emerald-100 mt-8 relative z-10">
            <div className="max-h-[600px] overflow-y-auto pr-4 scrollbar-custom">
              {messages.map((message, index) => {
                // Check if this is a bot response after an image upload
                const isResponseAfterImage = message.type !== 'user' && 
                  index > 0 && 
                  messages.slice(0, index).some(msg => msg.image);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatMessage 
                      message={message} 
                      isResponseAfterImage={isResponseAfterImage}
                      index={index}
                    />
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <ChatInput
                disabled={isLoading}
                isLoading={isLoading}
                imageDetected={imageDetected}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Create a new ChatbotPage component
const ChatbotPage = ({ isCollapsed }) => {
  const { messages, imageDetected, isLoading } = useApp();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className={`main-content-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <DecorativeBackground className="fixed inset-0 z-0" />
        
        <div className="relative z-10 px-3 py-2">
          {/* Enhanced back button with reference to Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center mb-1 bg-emerald-50/70 p-1.5 rounded-lg shadow-sm">
            <button 
              onClick={handleBackClick}
              className="flex items-center gap-2 bg-white hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="flex items-center ml-2 mt-1 sm:mt-0 sm:ml-3 text-emerald-700/80 text-sm">
              <span className="mx-2 text-emerald-700/60">Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-emerald-700">Chatbot</span>
            </div>
          </div>
          
          <div className={`chat-container backdrop-blur-md p-3 rounded-2xl border border-emerald-100 relative z-10 flex flex-col h-[calc(100vh-5rem)] max-w-[1400px] mx-auto`}>
            {messages.length > 0 ? (
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-custom">
                {messages.map((message, index) => {
                  // Check if this is a bot response after an image upload
                  const isResponseAfterImage = message.type !== 'user' && 
                    index > 0 && 
                    messages.slice(0, index).some(msg => msg.image);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 last:mb-1"
                    >
                      <ChatMessage 
                        message={message} 
                        isResponseAfterImage={isResponseAfterImage}
                        index={index}
                      />
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} className="h-2" />
              </div>
            ) : (
              // No extra space when empty
              <div className="h-0" />
            )}
            
            {/* Scroll to bottom button - positioned above chat input */}
            {messages.length > 2 && (
              <div className="relative w-full flex justify-center h-0">
                <motion.button
                  onClick={scrollToBottom}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full p-1.5 shadow-md transition-all duration-200 backdrop-blur-sm border border-emerald-200/50 group z-20"
                  aria-label="Scroll to bottom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transform group-hover:translate-y-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.button>
              </div>
            )}
            
            <div className={`bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-emerald-50`}>
              <ChatInput
                disabled={isLoading}
                isLoading={isLoading}
                imageDetected={imageDetected}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function AppContent() {
  const {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    removeTypingMessages,
    showCamera,
    setShowCamera,
    cameraError,
    setCameraError,
    setImageDetected,
    resetState
  } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { addNotification } = useNotifications();
  const { createActionNotification } = useActionNotifications();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notificationTrigger, setNotificationTrigger] = useState(null);
  const [showChatbotInSidebar, setShowChatbotInSidebar] = useState(false);
  
  // Initialize random notifications
  useRandomNotifications();

  // Listen for route changes
  const navigate = useNavigate();
  const location = useLocation();

  // Function to trigger notifications
  const triggerNotification = (action, data = {}) => {
    setNotificationTrigger({ action, data });
  };

  // Reset notification trigger after it's processed
  useEffect(() => {
    if (notificationTrigger) {
      const timer = setTimeout(() => {
        setNotificationTrigger(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [notificationTrigger]);

  const handleRouteChange = () => {
    // Reset state when navigating to dashboard
    if (location.pathname === '/dashboard') {
      resetState();
    }
    
    // Add notifications for specific routes
    if (location.pathname === '/connect-farmers') {
      createActionNotification('connect_farmers');
    } else if (location.pathname === '/crops-diseases') {
      createActionNotification('explore_library');
    }

    // Show chatbot in sidebar when on chatbot route
    if (location.pathname === '/chatbot') {
      setShowChatbotInSidebar(true);
    }
  };

  useEffect(() => {
    handleRouteChange();
  }, [location.pathname]);

  // Clear chatbot from sidebar on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('show_chatbot_sidebar');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check if we should show chatbot in sidebar after page load
    const shouldShowChatbot = sessionStorage.getItem('show_chatbot_sidebar');
    if (shouldShowChatbot === 'true' && location.pathname === '/chatbot') {
      setShowChatbotInSidebar(true);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Save chatbot sidebar state to session storage when it changes
  useEffect(() => {
    if (showChatbotInSidebar) {
      sessionStorage.setItem('show_chatbot_sidebar', 'true');
    }
  }, [showChatbotInSidebar]);
  
  const handleImageProcess = async (imageData) => {
    try {
      console.log('Starting image processing...'); // Debug log
      setShowCamera(false);
      setIsLoading(true);
      setImageDetected(true);
      
      // Show chatbot in sidebar
      setShowChatbotInSidebar(true);
      
      // Navigate to chatbot page
      navigate('/chatbot');
      
      // Trigger notification for photo capture
      triggerNotification(NotificationActions.PHOTO_CAPTURE);

      // Add user message with image
      addMessage({
        type: 'user',
        // content: 'I need help identifying this plant disease.',
        image: imageData,
        timestamp: new Date()
      });

      addMessage({
        type: 'bot',
        content: 'Analyzing image... Please wait while GreenGuard processes your image.',
        status: 'typing',
      });
      
      console.log('Converting image data to blob...');
      // Create form data
      const formData = new FormData();
      
      // Convert base64 data to blob with proper error handling
      try {
        const base64Data = imageData.split(',')[1];
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
        formData.append('image', blob, 'captured-image.jpg');
        console.log('Image blob created successfully', blob.size, 'bytes');
      } catch (blobError) {
        console.error('Error creating blob from image data:', blobError);
        throw new Error('Failed to process the captured image. Please try again.');
      }

      // Make the request with better error handling and timeout
      console.log('Sending image to backend for analysis...');
      const response = await axios.post(
        'http://localhost:5000/api/predict',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // Increase timeout to 60 seconds for processing large images
        }
      );

      console.log('Backend response received:', response.status);
      removeTypingMessages();

      if (response.data.status === 'success') {
        console.log('Analysis successful:', response.data.disease);
        addMessage({
          type: 'bot',
          content: `Disease detected: ${response.data.disease}\n\n${response.data.explanation}`,
          timestamp: new Date()
        });

        // Save to detection history
        try {
          const historyEntry = {
            timestamp: Date.now(),
            image: imageData,
            detection: response.data.disease,
            confidence: response.data.confidence,
            explanation: response.data.explanation,
            crop_type: response.data.crop_type,
            chatHistory: []
          };

          const existingHistory = JSON.parse(sessionStorage.getItem('detectionHistory') || '[]');
          sessionStorage.setItem('detectionHistory', JSON.stringify([...existingHistory, historyEntry]));
          console.log('Detection saved to history');
        } catch (historyError) {
          console.error('Error saving to history:', historyError);
          // Non-blocking error - don't throw
        }

        // Trigger notification for successful detection
        triggerNotification(NotificationActions.GENERATE_RESPONSE);
        
        // If disease was detected, trigger suggestion notification with delay
        if (response.data.disease) {
          setTimeout(() => {
            triggerNotification(NotificationActions.DISEASE_SUGGESTION, { 
              disease: response.data.disease 
            });
          }, 3000);
        }
      } else {
        console.error('Backend returned error status:', response.data);
        throw new Error(response.data.error || 'Failed to analyze image. The analysis was not successful.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      removeTypingMessages();
      
      // Determine if it's a network error or backend error
      let errorMessage = 'Failed to process the image. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        errorMessage = error.response.data?.error || 
                      `Server error (${error.response.status}): ${error.response.statusText}`;
        console.error('Backend error response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from the server. Please check your connection and try again.';
        console.error('No response received:', error.request);
      } else {
        // Error in setting up the request
        errorMessage = error.message;
      }
      
      addMessage({
        type: 'bot',
        content: errorMessage,
        status: 'error',
        timestamp: new Date()
      });
      
      // Also show notification
      addNotification({
        title: 'Detection Failed',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Include NotificationManager */}
      <NotificationManager triggerNotification={notificationTrigger} />
      
      <Navbar 
        isCollapsed={isSidebarCollapsed}
      />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          showChatbot={showChatbotInSidebar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={<DashboardPage handleImageProcess={handleImageProcess} isCollapsed={isSidebarCollapsed} />} 
            />
            <Route 
              path="/chatbot" 
              element={<ChatbotPage isCollapsed={isSidebarCollapsed} />} 
            />
            <Route 
              path="/detection-history" 
              element={<DetectionHistoryPage isCollapsed={isSidebarCollapsed} />} 
            />
            <Route 
              path="/crops-diseases" 
              element={
                <div className={`main-content-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} p-6`}>
                  Crops and Diseases Library
                </div>
              } 
            />
            <Route path="/fertilizers" element={<div className={`main-content-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} p-6`}>Fertilizers</div>} />
            <Route path="/connect-farmers" element={<ConnectFarmersPage isCollapsed={isSidebarCollapsed} />} />
            <Route 
              path="/connect-team" 
              element={<TeamPage isCollapsed={isSidebarCollapsed} />} 
            />
            <Route path="/profile" element={<div className={`main-content-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} p-6`}>Profile</div>} />
          </Routes>
        </main>
      </div>
      
      {/* Camera Component */}
      <AnimatePresence>
        {showCamera && (
          <Camera
            onCapture={handleImageProcess}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
