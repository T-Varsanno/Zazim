import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <TouchableOpacity onPress={toggleLanguage}>
      <Text style={{ paddingHorizontal: 10, fontWeight: 'bold' }}>
        {language === 'en' ? 'עברית' : 'English'}
      </Text>
    </TouchableOpacity>
  );
}