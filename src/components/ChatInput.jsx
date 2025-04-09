import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, Mic, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import PropTypes from 'prop-types';

const ChatInput = ({
  disabled,
  isLoading,
  imageDetected
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { addMessage, handleError, messages, removeTypingMessages, setImageDetected, setIsLoading } = useApp();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef(null);

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

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addNotification({
        title: 'Voice Input Not Supported',
        message: 'Your browser does not support voice input.',
        type: 'error'
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      addNotification({
        title: 'Voice Input Error',
        message: 'Failed to recognize speech. Please try again.',
        type: 'error'
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      addNotification({
        title: 'Invalid File Type',
        message: 'Please upload a valid image file (JPG or PNG).',
        type: 'error'
      });
      return;
    }

    try {
      setIsLoading(true);
      setImageDetected(true);

      // Add user message with image
      addMessage({
        type: 'user',
        image: URL.createObjectURL(file),
        timestamp: new Date()
      });

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

      removeTypingMessages();

      if (response.data.status === 'success') {
        addMessage({
          type: 'bot',
          content: `Disease detected: ${response.data.disease}\n\n${response.data.explanation}`,
          timestamp: new Date()
        });

        // Save to detection history
        const historyEntry = {
          timestamp: Date.now(),
          image: URL.createObjectURL(file),
          detection: response.data.disease,
          confidence: response.data.confidence,
          explanation: response.data.explanation,
          crop_type: response.data.crop_type,
          chatHistory: messages
        };

        const existingHistory = JSON.parse(sessionStorage.getItem('detectionHistory') || '[]');
        sessionStorage.setItem('detectionHistory', JSON.stringify([...existingHistory, historyEntry]));

        // Show success notification
        addNotification({
          title: 'Disease Detection Complete',
          message: 'Your crop image has been successfully analyzed.',
          type: 'success'
        });

        // If disease was detected, show disease alert
        if (response.data.disease) {
          addNotification({
            title: 'Disease Alert',
            message: 'Important information about detected crop disease',
            type: 'warning'
          });
        }
      } else {
        throw new Error(response.data.error || 'Failed to analyze image');
      }
    } catch (error) {
      removeTypingMessages();
      const errorMessage = error.response?.data?.error || error.message || 'Failed to process the image. Please try again.';
      
      addMessage({
        type: 'bot',
        content: errorMessage,
        status: 'error',
        timestamp: new Date()
      });

      addNotification({
        title: 'Detection Failed',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
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

        <div className="flex items-center space-x-2">
          {/* Image Upload Button */}
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className={`p-3 rounded-xl shadow-md transition-all duration-300
              ${disabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
              }`}
            aria-label="Upload image"
          >
            <ImageIcon className="w-6 h-6" />
          </motion.button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
          />

          {/* Voice Input Button */}
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            type="button"
            onClick={handleVoiceInput}
            disabled={disabled || isLoading}
            className={`p-3 rounded-xl shadow-md transition-all duration-300
              ${disabled
                ? 'bg-gray-300 cursor-not-allowed'
                : isListening
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
              }`}
            aria-label={isListening ? "Stop recording" : "Start voice input"}
          >
            <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
          </motion.button>
        
          {/* Send Button */}
          <motion.button
            whileHover={{ scale: disabled || !input.trim() ? 1 : 1.05 }}
            whileTap={{ scale: disabled || !input.trim() ? 1 : 0.95 }}
            type="submit"
            disabled={disabled || isLoading || !input.trim()}
            className={`p-3 rounded-xl shadow-md transition-all duration-300
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

ChatInput.propTypes = {
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  imageDetected: PropTypes.bool
};

ChatInput.defaultProps = {
  disabled: false,
  isLoading: false,
  imageDetected: false
};

export default ChatInput;
