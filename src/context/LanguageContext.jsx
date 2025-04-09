import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const changeLanguage = useCallback(async (language) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      localStorage.setItem('preferredLanguage', language);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, [i18n]);

  const value = {
    currentLanguage,
    changeLanguage,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'हिंदी' },
      { code: 'mr', name: 'मराठी' },
      { code: 'gu', name: 'ગુજરાતી' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 