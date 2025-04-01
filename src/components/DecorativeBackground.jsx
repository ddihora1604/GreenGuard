import React from 'react';
import { motion } from 'framer-motion';

const DecorativeBackground = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-100/50 to-green-100" />
      
      {/* Decorative plants - Large leaves */}
      <div className="absolute bottom-0 left-0 w-72 h-72 opacity-20">
        <motion.svg
          viewBox="0 0 200 200"
          animate={{ rotate: 0 }}
          className="transform"
        >
          <path
            d="M100 20C70 20 45 45 45 75C45 105 70 130 100 130C130 130 155 105 155 75C155 45 130 20 100 20Z"
            className="fill-green-700"
          />
        </motion.svg>
      </div>

      {/* Corner plants */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-15">
        <motion.svg
          viewBox="0 0 200 200"
          animate={{ rotate: 0 }}
          className="transform"
        >
          <path
            d="M100 30C60 30 30 60 30 100C30 140 60 170 100 170C140 170 170 140 170 100C170 60 140 30 100 30Z"
            className="fill-emerald-800"
          />
        </motion.svg>
      </div>

      {/* Floating leaves */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-16 h-16"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            opacity: 0.2,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 10C35 10 20 25 20 40C20 55 35 70 50 70C65 70 80 55 80 40C80 25 65 10 50 10Z"
              className="fill-green-600"
            />
          </svg>
        </div>
      ))}

      {/* Plant patterns */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-[0.07]">
          <defs>
            {/* Monstera leaf pattern */}
            <pattern id="monstera" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M40,20 C20,40 20,60 40,80 C60,60 60,40 40,20 M60,20 C40,40 40,60 60,80 C80,60 80,40 60,20"
                className="stroke-emerald-700"
                fill="none"
                strokeWidth="2"
              />
            </pattern>
            {/* Simple leaf pattern */}
            <pattern id="leaves" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M25 10C15 10 10 20 10 25C10 30 15 40 25 40C35 40 40 30 40 25C40 20 35 10 25 10Z"
                className="fill-green-800/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#monstera)" />
          <rect width="100%" height="100%" fill="url(#leaves)" />
        </svg>
      </div>

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl"
      />
      
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-emerald-200/20 to-green-300/20 rounded-full blur-3xl"
      />

      {/* Small decorative dots */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-600/20 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Tree silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M0,100 L20,80 L40,100 L60,70 L80,100 L100,60 L120,100 L140,75 L160,100 L180,65 L200,100 L220,80 L240,100 L260,70 L280,100 L300,60 L320,100 L340,75 L360,100 L380,65 L400,100"
            className="fill-green-900"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default DecorativeBackground;
