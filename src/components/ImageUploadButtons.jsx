import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

const ImageUploadButtons = ({ onUpload, setShowCamera, isLoading = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const validateAndProcessFile = useCallback((file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result);
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    validateAndProcessFile(file);
  }, [validateAndProcessFile]);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current += 1;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0 && !isLoading) {
      setIsDragging(true);
    }
  }, [isLoading]);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current -= 1;
    
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && !isLoading) {
      // This is needed to indicate we can drop
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [isLoading]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (isLoading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
      e.dataTransfer.clearData();
    }
  }, [isLoading, validateAndProcessFile]);

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`
              flex flex-col items-center justify-center gap-4 cursor-pointer
              bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600
              text-white p-8 rounded-2xl shadow-lg
              group-hover:shadow-green-500/30 group-hover:shadow-xl
              transition-all duration-300
              min-h-[180px]
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${isDragging ? 'ring-4 ring-green-300 scale-[1.02] shadow-xl' : ''}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className={`w-8 h-8 ${isDragging ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col text-center">
                  <span className="text-xl font-bold">
                    {isDragging ? 'Drop Image Here' : 'Upload Image'}
                  </span>
                  <span className="text-sm opacity-80">
                    {isDragging ? 'Release to upload' : 'Drag & drop or click to browse'}
                  </span>
                  <span className="text-xs opacity-80 mt-1">JPG, PNG, GIF (max 5MB)</span>
                </div>
              </>
            )}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
            />
          </label>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCamera(true)}
          disabled={isLoading}
          className={`
            relative group flex items-center justify-center gap-4
            bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600
            text-white p-8 rounded-2xl shadow-lg min-h-[180px]
            hover:shadow-purple-500/30 hover:shadow-xl
            transition-all duration-300
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Camera className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">Take Photo</span>
            <span className="text-sm opacity-80">Use your camera</span>
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          />
        </motion.button>
      </div>
    </AnimatePresence>
  );
};

ImageUploadButtons.propTypes = {
  onUpload: PropTypes.func.isRequired,
  setShowCamera: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default ImageUploadButtons;