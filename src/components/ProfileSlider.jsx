import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ProfileSlider = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60]"
            onClick={onClose}
          />
          
          {/* Profile Slider */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200 
            }}
            className="fixed top-0 right-0 h-full w-[320px] z-[61]"
          >
            <div className="relative h-full overflow-y-auto bg-gradient-to-b from-green-50/90 to-emerald-50/90 backdrop-blur-md border-l border-emerald-100">
              <div className="sticky top-0 z-10 bg-white/50 backdrop-blur-sm border-b border-emerald-100 px-4 py-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-emerald-800">Profile</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-green-100/80 text-green-700"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-col items-center mb-6 pt-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <img
                      className="w-20 h-20 rounded-full shadow-lg ring-4 ring-green-100 mb-3"
                      src="https://t3.ftcdn.net/jpg/03/26/84/88/360_F_326848805_qtf1DQC7b5IOsOw0f4PhUV5ubr3W7Oho.jpg"
                      alt="Profile"
                    />
                  </motion.div>
                  <h3 className="text-lg font-bold text-emerald-800">Darshan Dihora</h3>
                  <p className="text-sm text-emerald-600">AI Enthusiast</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Email', value: 'darshan.dihora@djsce.edu.in' },
                    { label: 'Role', value: 'Third-year B. Tech Student' },
                    { label: 'Department', value: 'Artificial Intelligence and Data Science' },
                    { label: 'Organization', value: "SVKM's Dwarkadas J. Sanghvi College of Engineering" },
                    { label: 'Location', value: 'Mumbai, Maharashtra, India' },
                    { label: 'Joined', value: 'December 2022' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white/60 rounded-lg p-3 backdrop-blur-sm hover:bg-white/70 transition-colors duration-200"
                    >
                      <h4 className="text-xs font-semibold text-emerald-800 mb-0.5">{item.label}</h4>
                      <p className="text-sm text-emerald-600">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileSlider; 