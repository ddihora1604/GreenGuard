import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Calendar, Search, X, Trash2, MessageSquare } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import PropTypes from 'prop-types';

const DetectionHistoryPage = ({ isCollapsed }) => {
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [showConversation, setShowConversation] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Retrieve detection history from localStorage
    const storedHistory = localStorage.getItem('detectionHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setDetectionHistory(parsedHistory);
        
        // Initialize expanded state for all dates
        const initialExpandedDates = {};
        parsedHistory.forEach(item => {
          const dateKey = new Date(item.timestamp).toLocaleDateString();
          initialExpandedDates[dateKey] = true; // Initially expand all dates
        });
        setExpandedDates(initialExpandedDates);
      } catch (e) {
        console.error("Failed to parse detection history:", e);
      }
    }
  }, []);

  // Group detections by date
  const getGroupedDetections = () => {
    const grouped = {};
    
    detectionHistory.forEach(detection => {
      const date = new Date(detection.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(detection);
    });
    
    return grouped;
  };

  const toggleDateExpand = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const toggleItemExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleConversation = (id) => {
    setShowConversation(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const deleteDetection = (id) => {
    const updatedHistory = detectionHistory.filter(item => item.id !== id);
    setDetectionHistory(updatedHistory);
    localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory));
    addNotification({
      title: "Detection deleted",
      message: "Detection record has been removed from history",
      type: "warning"
    });
  };

  const clearAllHistory = () => {
    setDetectionHistory([]);
    localStorage.removeItem('detectionHistory');
    addNotification({
      title: "History cleared",
      message: "All detection records have been removed",
      type: "warning"
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const filteredDetections = Object.entries(getGroupedDetections())
    .filter(([date]) => {
      if (filterDate) {
        return date.includes(filterDate);
      }
      return true;
    })
    .reduce((acc, [date, detections]) => {
      const filtered = detections.filter(detection => 
        detection.plantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detection.diseaseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (detection.confidence && detection.confidence.toString().includes(searchTerm)) ||
        (detection.detection?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (filtered.length > 0) {
        acc[date] = filtered;
      }
      
      return acc;
    }, {});

  return (
    <div className={`p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">Detection History</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by plant, disease or confidence level"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by date"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {detectionHistory.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearAllHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all history
                </button>
              </div>

              {Object.keys(filteredDetections).length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No detections match your search criteria
                </div>
              ) : (
                Object.entries(filteredDetections)
                  .sort(([dateA], [dateB]) => {
                    // Sort dates in descending order (newest first)
                    return new Date(dateB) - new Date(dateA);
                  })
                  .map(([date, detections]) => (
                    <div key={date} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleDateExpand(date)}
                        className="w-full flex justify-between items-center px-4 py-3 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <h3 className="font-medium text-emerald-800">
                          {date} <span className="text-emerald-600">({detections.length} detections)</span>
                        </h3>
                        {expandedDates[date] ? (
                          <ArrowUp className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-emerald-600" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedDates[date] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="divide-y divide-gray-200">
                              {detections
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                .map(detection => (
                                  <div key={detection.id || Date.now() + Math.random()} className="p-4">
                                    <div 
                                      className="flex justify-between items-start cursor-pointer"
                                      onClick={() => toggleItemExpand(detection.id)}
                                    >
                                      <div className="flex items-center gap-3">
                                        {(detection.imageUrl || detection.image) && (
                                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200">
                                            <img 
                                              src={detection.imageUrl || detection.image} 
                                              alt={detection.plantName || detection.detection || "Plant image"} 
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        )}
                                        <div>
                                          <h4 className="font-medium text-gray-900">
                                            {detection.plantName || detection.detection || "Unknown plant"}
                                            {detection.diseaseName && (
                                              <span className="text-red-500"> - {detection.diseaseName}</span>
                                            )}
                                          </h4>
                                          <p className="text-sm text-gray-500">
                                            {formatTime(detection.timestamp)}
                                            {detection.confidence && (
                                              <span> - Confidence: {(detection.confidence * 100).toFixed(2)}%</span>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {expandedItems[detection.id] ? (
                                          <ArrowUp className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <ArrowDown className="h-4 w-4 text-gray-400" />
                                        )}
                                      </div>
                                    </div>

                                    <AnimatePresence>
                                      {expandedItems[detection.id] && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="mt-4"
                                        >
                                          <div className="flex justify-between mb-2">
                                            <button
                                              onClick={() => toggleConversation(detection.id)}
                                              className="flex items-center gap-1 px-3 py-1 text-sm bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100"
                                            >
                                              <MessageSquare className="h-4 w-4" />
                                              {showConversation[detection.id] ? 'Hide conversation' : 'Show conversation'}
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteDetection(detection.id);
                                              }}
                                              className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                              Delete
                                            </button>
                                          </div>

                                          <AnimatePresence>
                                            {showConversation[detection.id] && detection.conversation && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-2 p-3 bg-gray-50 rounded-md text-sm max-h-60 overflow-y-auto"
                                              >
                                                {detection.conversation.map((msg, idx) => (
                                                  <div 
                                                    key={idx}
                                                    className={`mb-2 p-2 rounded ${
                                                      msg.isUser 
                                                        ? 'bg-emerald-100 text-emerald-800 ml-auto' 
                                                        : 'bg-white border border-gray-200'
                                                    } max-w-[85%] ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
                                                  >
                                                    {msg.text}
                                                  </div>
                                                ))}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-emerald-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No detection history found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your plant disease detection history will appear here once you&apos;ve analyzed some plants.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add prop validation
DetectionHistoryPage.propTypes = {
  isCollapsed: PropTypes.bool
};

// Add default props
DetectionHistoryPage.defaultProps = {
  isCollapsed: false
};

export default DetectionHistoryPage;
