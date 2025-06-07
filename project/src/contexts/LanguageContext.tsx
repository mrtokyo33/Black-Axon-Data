import React, { createContext, useContext, useState, useEffect } from 'react';
import { enTranslations } from '../locales/en';
import { ptTranslations } from '../locales/pt';
import { ruTranslations } from '../locales/ru';

type Language = 'en' | 'pt' | 'ru';

interface LanguageContextType {
  language: Language;
  translations: typeof enTranslations;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(enTranslations);
  
  useEffect(() => {
    // Check for stored language preference
    const storedLanguage = localStorage.getItem('black-axon-language') as Language | null;
    if (storedLanguage && ['en', 'pt', 'ru'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
      
      // Set translations based on stored language
      if (storedLanguage === 'pt') {
        setTranslations(ptTranslations);
      } else if (storedLanguage === 'ru') {
        setTranslations(ruTranslations);
      } else {
        setTranslations(enTranslations);
      }
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'pt') {
        setLanguage('pt');
        setTranslations(ptTranslations);
      } else if (browserLang === 'ru') {
        setLanguage('ru');
        setTranslations(ruTranslations);
      }
      // Defaults to English if neither stored nor detected
    }
  }, []);
  
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('black-axon-language', lang);
    
    switch (lang) {
      case 'pt':
        setTranslations(ptTranslations);
        break;
      case 'ru':
        setTranslations(ruTranslations);
        break;
      default:
        setTranslations(enTranslations);
        break;
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};