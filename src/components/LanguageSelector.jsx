import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-emerald-100 text-emerald-700 px-3 py-1.5 pr-8 rounded-lg text-sm font-medium 
                 hover:bg-emerald-200 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 
                 focus:ring-emerald-500 focus:ring-opacity-50"
        aria-label="Select language"
      >
        {languages.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-700">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </motion.div>
  );
};

export default LanguageSelector; 