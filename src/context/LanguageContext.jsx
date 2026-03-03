// src/context/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
  BN: 'bn',
  EN: 'en'
};

const translations = {
  [LANGUAGES.BN]: {
    appName: 'BD Safe',
    appSubtitle: 'বাংলাদেশ অপরাধ মানচিত্র',
    searchPlaceholder: 'অনুসন্ধান করুন...',
    crimeType: 'অপরাধের ধরন',
    time: 'সময়',
    timeFilter: 'সময় ফিল্টার',
    timeFilterActive: 'সময় ফিল্টার সক্রিয়',
    totalLocations: 'মোট অবস্থান',
    murder: 'হত্যা',
    rape: 'ধর্ষণ',
    robbery: 'ডাকাতি',
    kidnapping: 'অপহরণ',
    drugs: 'মাদক',
    others: 'অন্যান্য',
    byRiskLevel: 'ঝুঁকির মাত্রা অনুযায়ী',
    critical: 'সবচেয়ে ঝুঁকিপূর্ণ',
    high: 'উচ্চ ঝুঁকি',
    medium: 'মাঝারি ঝুঁকি',
    low: 'নিম্ন ঝুঁকি',
    normal: 'স্বাভাবিক',
    hotspot: 'হটস্পট',
    totalDistricts: 'মোট জেলা',
    byCases: 'মামলা অনুযায়ী',
    cases: 'টি মামলা',
    riskLevel: 'ঝুঁকির মাত্রা',
    criticalRisk: 'সবচেয়ে ঝুঁকিপূর্ণ',
    highRisk: 'উচ্চ ঝুঁকি',
    mediumRisk: 'মাঝারি ঝুঁকি',
    recentEvents: 'সাম্প্রতিক ঘটনা',
    district: 'জেলা',
    heatmap: 'হিটম্যাপ',
    timeline: 'টাইমলাইন',
    list: 'তালিকা',
    bangladeshCrimeMap: 'বাংলাদেশ অপরাধ মানচিত্র'
  },
  [LANGUAGES.EN]: {
    appName: 'BD Safe',
    appSubtitle: 'Bangladesh Crime Map',
    searchPlaceholder: 'Search...',
    crimeType: 'Crime Type',
    time: 'Time',
    timeFilter: 'Time Filter',
    timeFilterActive: 'Time Filter Active',
    totalLocations: 'Total Locations',
    murder: 'Murder',
    rape: 'Rape',
    robbery: 'Robbery',
    kidnapping: 'Kidnapping',
    drugs: 'Drugs',
    others: 'Others',
    byRiskLevel: 'By Risk Level',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    normal: 'Normal',
    hotspot: 'Hotspot',
    totalDistricts: 'Total Districts',
    byCases: 'By Cases',
    cases: ' cases',
    riskLevel: 'Risk Level',
    criticalRisk: 'Critical',
    highRisk: 'High',
    mediumRisk: 'Medium',
    recentEvents: 'Recent Events',
    district: 'District',
    heatmap: 'Heatmap',
    timeline: 'Timeline',
    list: 'List',
    bangladeshCrimeMap: 'Bangladesh Crime Map'
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES.BN);

  const toggleLanguage = () => {
    setLanguage(prev => prev === LANGUAGES.BN ? LANGUAGES.EN : LANGUAGES.BN);
  };

  const t = (key, params) => {
    let text = translations[language][key] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};