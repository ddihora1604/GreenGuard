import { useState, useCallback, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, X, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

const Camera = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null); // Ref for the Webcam component
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return;
    
    try {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Call the onCapture function passed from parent component
        // This will handle the redirect to the chatbot page
        onCapture(imageSrc);
        // Don't call onClose here, let the parent component handle navigation
      } else {
        setError('Failed to capture image. Please try again.');
        setIsCapturing(false);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setError('An error occurred while capturing the image. Please try again.');
      setIsCapturing(false);
    }
  }, [onCapture]);

  // Handle camera errors
  const handleUserMediaError = useCallback((err) => {
    console.error('Camera access error:', err);
    setError(`Camera access error: ${err.name === 'NotAllowedError' 
      ? 'Permission denied. Please allow camera access.'
      : err.message || 'Could not access camera'}`);
    setIsCameraReady(false);
  }, []);

  // Cleanup on unmount (optional but good practice)
  useEffect(() => {
    return () => {
      if (webcamRef.current) {
        try {
          const stream = webcamRef.current.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        } catch (err) {
          console.error('Error stopping camera stream:', err);
        }
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full"
          aria-label="Close Camera"
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>

        {error ? (
          <div className="flex flex-col items-center justify-center h-80 p-6 bg-red-50 text-red-800">
            <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
            <p className="text-center mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsCameraReady(false);
              }} 
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative aspect-video">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              onUserMedia={() => setIsCameraReady(true)}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "environment"
              }}
            />
            {isCameraReady && (
              <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
                <span className="text-white text-sm flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Camera ready
                </span>
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCapture}
            disabled={!isCameraReady || isCapturing || error}
            className="w-full flex items-center justify-center gap-2 bg-white text-black 
                     font-medium py-3 px-6 rounded-xl shadow-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100 transition-all"
            aria-label="Capture Photo"
          >
            <CameraIcon className="w-5 h-5" />
            {isCapturing ? 'Processing...' : 'Capture Photo'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Add prop validation
Camera.propTypes = {
  onCapture: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Camera;
