import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';

const ChatInput = ({
  disabled,
  isLoading,
  imageDetected
}) => {
  const [input, setInput] = useState('');
  const { addMessage, handleError, messages, removeTypingMessages } = useApp();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to chat
    addMessage({
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Add typing indicator
    addMessage({
      type: 'bot',
      content: 'Thinking...',
      status: 'typing'
    });

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        context: messages
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      removeTypingMessages();
      
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      addMessage({
        type: 'bot',
        content: response.data.message,
        timestamp: new Date()
      });

      handleBotResponse(response.data.message);
    } catch (error) {
      removeTypingMessages();
      const errorMessage = handleError(error);
      addMessage({
        type: 'bot',
        content: errorMessage,
        status: 'error',
        timestamp: new Date()
      });
    }
  };

  const handleBotResponse = (response) => {
    // If response contains treatment recommendations
    if (response.includes('treatment') || response.includes('recommendation')) {
      addNotification({
        title: 'Treatment Recommendation',
        message: 'New treatment advice available for your crop',
        type: 'info'
      });
    }

    // If it's an important disease detection
    if (response.includes('disease detected') || response.includes('infection')) {
      addNotification({
        title: 'Disease Alert',
        message: 'Important information about detected crop disease',
        type: 'warning'
      });
    }
  };

  const getPlaceholderText = () => {
    if (!imageDetected) return "Upload a crop image to start";
    if (disabled) return "Please wait while GreenGuard detects the crop disease";
    return "Ask anything about the crop disease or its treatment";
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      onSubmit={handleSubmit}
      className="relative group"
    >
      <div className={`flex items-center backdrop-blur-md rounded-2xl shadow-lg p-3 border-2 transition-all duration-300
        ${disabled 
          ? 'bg-gray-100/90 border-gray-200' 
          : 'bg-white/90 border-green-200 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10'
        }`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={getPlaceholderText()}
          disabled={disabled || isLoading}
          className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 disabled:text-gray-400 font-medium text-lg rounded-lg"
          aria-label="Chat input"
        />
        
        <motion.button
          whileHover={{ scale: disabled || !input.trim() ? 1 : 1.05 }}
          whileTap={{ scale: disabled || !input.trim() ? 1 : 0.95 }}
          type="submit"
          disabled={disabled || isLoading || !input.trim()}
          className={`ml-2 p-4 rounded-xl shadow-md transition-all duration-300
            ${disabled || !input.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20'
            }`}
          aria-label={isLoading ? "Sending message..." : "Send message"}
        >
          {isLoading ? (
            <Loader className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Send className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>

      {/* Gradient background effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-10 -z-10 transition-opacity duration-300"
        initial={{ scale: 0.95 }}
        whileHover={{ scale: 1 }}
      />

      {/* Error message for disabled state */}
      {disabled && !imageDetected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 mt-2 text-center"
        >
          Upload a plant image to start the consultation
        </motion.p>
      )}
    </motion.form>
  );
};

export default ChatInput;
