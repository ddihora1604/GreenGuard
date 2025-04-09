import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Clear localStorage when the application loads
  useEffect(() => {
    // Remove all GreenGuard related localStorage items
    localStorage.removeItem('greenguard_messages');
    localStorage.removeItem('greenguard_imageDetected');
    // Also clear any session storage
    sessionStorage.removeItem('detectionHistory');
    sessionStorage.removeItem('show_chatbot_sidebar');
  }, []); // Empty dependency array means this runs once on mount

  // Initialize with empty state instead of loading from localStorage
  const [messages, setMessages] = useState([]);
  const [imageDetected, setImageDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Camera related state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('greenguard_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('greenguard_imageDetected', JSON.stringify(imageDetected));
  }, [imageDetected]);

  // Full reset function (clears all state)
  const resetState = useCallback(() => {
    setMessages([]);
    setImageDetected(false);
    setIsLoading(false);
    setShowCamera(false);
    setCameraError(null);
    // Also clear localStorage when reset is called
    localStorage.removeItem('greenguard_messages');
    localStorage.removeItem('greenguard_imageDetected');
  }, []);

  // New function that only resets loading-related states but preserves messages and image data
  const resetLoadingState = useCallback(() => {
    setIsLoading(false);
    setShowCamera(false);
    setCameraError(null);
  }, []);

  const handleError = (error) => {
    console.error('Error:', error);
    const errorMessage =
      error.response?.data?.error || error.message || 'An unexpected error occurred. Please try again.';
    setError(errorMessage);
    return errorMessage;
  };

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (index, updatedMessage) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[index] = { ...newMessages[index], ...updatedMessage };
      return newMessages;
    });
  };

  const removeTypingMessages = () => {
    setMessages((prev) => prev.filter((msg) => msg.status !== 'typing'));
  };

  const clearState = () => {
    setMessages([]);
    setImageDetected(false);
    setError(null);
    setShowCamera(false);
    setCameraError(null);
    localStorage.removeItem('greenguard_messages');
    localStorage.removeItem('greenguard_imageDetected');
  };

  const value = {
    messages,
    setMessages,
    imageDetected,
    setImageDetected,
    isLoading,
    setIsLoading,
    error,
    setError,
    handleError,
    addMessage,
    updateMessage,
    removeTypingMessages,
    clearState,
    resetState,
    resetLoadingState,
    showCamera,
    setShowCamera,
    cameraError,
    setCameraError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 