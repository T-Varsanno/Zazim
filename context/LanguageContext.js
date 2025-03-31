// context/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    greeting: 'Hi',
    home: 'Home',
    activities: 'Activities',
    achievements: 'Achievements',
    profile: 'Profile',
    start: 'Start',
    completed: 'Completed',
    points: 'pts',
    todaysGoal: "Today's Goal",
  },
  he: {
    greeting: 'שלום',
    home: 'בית',
    activities: 'פעילויות',
    achievements: 'הישגים',
    profile: 'פרופיל',
    start: 'התחל',
    completed: 'הושלם',
    points: 'נקודות',
    todaysGoal: 'מטרת היום',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('he');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'he' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
