import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import logoIcon from '../assets/images/Logo3 Light Green Without Background.png';
import { useApp } from '../context/AppContext';
import { useActionNotifications } from '../context/ActionNotificationContext';

const PROFILE_IMAGE_URL = "https://t3.ftcdn.net/jpg/03/26/84/88/360_F_326848805_qtf1DQC7b5IOsOw0f4PhUV5ubr3W7Oho.jpg";

const ChatMessage = ({ message, isResponseAfterImage = false, index }) => {
  const isUser = message.type === 'user';
  const isTyping = message.status === 'typing';
  const isError = message.status === 'error';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { updateMessage } = useApp();
  const { showActionNotification } = useActionNotifications();

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const copyToClipboard = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          showActionNotification('Item copied to clipboard', 'success', 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleRegenerate = () => {
    // Update the existing message with a new timestamp
    updateMessage(index, {
      ...message,
      timestamp: new Date(),
      status: message.status === 'error' ? undefined : message.status // Clear error status if present
    });
  };

  const handleFeedback = (isPositive) => {
    // To be implemented: Logic to handle feedback
    console.log(`Feedback: ${isPositive ? 'Positive' : 'Negative'}`);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mr-3 flex-shrink-0"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center shadow-lg
              ${isError 
                ? 'bg-red-500' 
                : 'bg-white'
              }
              p-1
            `}
          >
            <img 
              src={logoIcon} 
              alt="GreenGuard" 
              className="w-7 h-7 object-contain"
            />
          </motion.div>
        </motion.div>
      )}

      {isUser ? (
        <div className="flex flex-col items-end">
          <motion.div
            className={`
              inline-block p-4 rounded-2xl backdrop-blur-sm
              bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-none
              min-w-[100px] max-w-[50vw]
              ${message.content && message.content.length < 50 
                ? 'whitespace-nowrap' 
                : 'whitespace-normal break-words'}
            `}
          >
            {message.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3 relative group"
              >
                <img
                  src={message.image}
                  alt="Plant Image"
                  className="max-w-full rounded-xl shadow-md"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center"
                >
                  <motion.img
                    src={PROFILE_IMAGE_URL}
                    alt="User Profile"
                    className="w-12 h-12 rounded-full border-2 border-white/70 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 flex-nowrap whitespace-nowrap"
                >
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          transition: {
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.2
                          }
                        }}
                        className="w-3 h-3 bg-green-500 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-emerald-700 whitespace-nowrap">Detecting Crop Disease</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full"
                >
                  <ReactMarkdown 
                    className="prose prose-invert prose-headings:text-white prose-a:text-emerald-200 prose-strong:text-white max-w-none"
                    components={{
                      h1: ({...props}) => <h1 style={{color: '#ffffff', fontWeight: 700}} {...props} />,
                      h2: ({...props}) => <h2 style={{color: '#ffffff', fontWeight: 700}} {...props} />,
                      h3: ({...props}) => <h3 style={{color: '#ffffff', fontWeight: 700}} {...props} />,
                      p: ({...props}) => <p style={{color: '#ffffff', fontWeight: 500}} {...props} />,
                      li: ({...props}) => <li style={{color: '#ffffff', fontWeight: 500}} {...props} />,
                      strong: ({...props}) => <strong style={{color: '#ffffff', fontWeight: 700}} {...props} />
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {message.timestamp && (
            <div className="text-xs mt-1 mr-1 text-right font-medium text-emerald-700">
              {formatTimestamp(message.timestamp)}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start w-full">
          <motion.div
            className={`
              inline-block max-w-[80%] p-4 rounded-2xl backdrop-blur-sm
              ${isError
                ? 'bg-red-50 border-red-200 shadow-lg rounded-bl-none'
                : isResponseAfterImage 
                  ? 'bg-white shadow-xl border-2 border-emerald-300 rounded-bl-none'
                  : 'bg-white/95 shadow-lg rounded-bl-none border border-green-100'
              }
              whitespace-normal break-words overflow-hidden
            `}
          >
            {message.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3 relative group"
              >
                <img
                  src={message.image}
                  alt="Plant Image"
                  className="max-w-full rounded-xl shadow-md"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center"
                >
                  <motion.img
                    src={PROFILE_IMAGE_URL}
                    alt="User Profile"
                    className="w-12 h-12 rounded-full border-2 border-white/70 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2 flex-nowrap whitespace-nowrap"
                >
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          transition: {
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.2
                          }
                        }}
                        className="w-3 h-3 bg-green-500 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-emerald-700 whitespace-nowrap">Detecting Crop Disease</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="overflow-hidden"
                >
                  <div className={isResponseAfterImage ? 'bg-emerald-50 p-5 rounded-lg border-2 border-emerald-400 shadow-md' : ''}>
                    <div className={isResponseAfterImage ? 'disease-detection-content' : ''}>
                      <ReactMarkdown 
                        className={`prose ${
                          isError 
                            ? 'prose-red prose-headings:text-red-700 prose-a:text-red-600'
                            : isResponseAfterImage
                              ? 'max-w-none prose-headings:text-emerald-800 prose-headings:font-bold prose-a:text-emerald-700 prose-strong:text-gray-900 prose-p:text-gray-900 prose-li:text-gray-900 prose-p:font-semibold prose-li:font-semibold prose-p:leading-relaxed' 
                              : 'prose-emerald prose-headings:text-emerald-800 prose-a:text-emerald-600 prose-strong:text-emerald-700'
                        } max-w-none`}
                        components={{
                          h1: ({...props}) => <h1 style={{color: '#065f46', fontWeight: 700}} {...props} />,
                          h2: ({...props}) => <h2 style={{color: '#065f46', fontWeight: 700}} {...props} />,
                          h3: ({...props}) => <h3 style={{color: '#065f46', fontWeight: 700}} {...props} />,
                          p: ({...props}) => <p style={{color: '#111827', fontWeight: 500}} {...props} />,
                          li: ({...props}) => <li style={{color: '#111827', fontWeight: 500}} {...props} />,
                          strong: ({...props}) => <strong style={{color: '#064e3b', fontWeight: 700}} {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {message.timestamp && !isTyping && (
            <div className="w-full flex flex-col space-y-2">
              <div className="flex justify-between items-center mt-1 ml-1">
                <div className="text-xs font-medium text-emerald-700">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
              
              <div className="flex space-x-1 ml-1">
                {!isUser && message.content && !isTyping && (
                  <button 
                    onClick={handleSpeak}
                    className="flex items-center px-2 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors"
                    title={isSpeaking ? 'Stop speaking' : 'Speak text'}
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="currentColor"
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isSpeaking ? (
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                      ) : (
                        <>
                          <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                          <path d="M15.54 8.46C16.9257 9.84645 17.7225 11.7563 17.7225 13.755C17.7225 15.7537 16.9257 17.6636 15.54 19.05" />
                          <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 22 12C22 14.6516 20.9447 17.1947 19.07 19.07" />
                        </>
                      )}
                    </svg>
                  </button>
                )}

                <button 
                  onClick={copyToClipboard}
                  className="flex items-center px-2 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors"
                >
                  {copied ? (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Copied
                    </motion.span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      Copy
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={handleRegenerate}
                  className="flex items-center px-2 py-1 text-xs bg-emerald-100 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Regenerate
                </button>

                
                
                <button 
                  onClick={() => handleFeedback(true)}
                  className="flex items-center px-2 py-1 text-xs bg-emerald-100 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  Like
                </button>
                
                <button 
                  onClick={() => handleFeedback(false)}
                  className="flex items-center px-2 py-1 text-xs bg-emerald-100 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"></path>
                  </svg>
                  Dislike
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="ml-3 flex-shrink-0"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden"
          >
            <img 
              src={PROFILE_IMAGE_URL}
              alt="User Profile" 
              className="w-10 h-10 object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    content: PropTypes.string,
    status: PropTypes.string,
    image: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date)
  }).isRequired,
  isResponseAfterImage: PropTypes.bool,
  index: PropTypes.number.isRequired
};

export default ChatMessage;
