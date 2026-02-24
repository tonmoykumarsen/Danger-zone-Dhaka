import React, { createContext, useState, useContext, useEffect } from 'react';

export const LANGUAGES = {
  BN: 'bn',
  EN: 'en'
};

export const TRANSLATIONS = {
  [LANGUAGES.BN]: {
    // App
    appName: 'ডেঞ্জারজোন',
    appSubtitle: 'বাংলাদেশ - অপরাধ মানচিত্র',
    
    // Header
    searchPlaceholder: 'অঞ্চল বা অপরাধের ধরন খুঁজুন...',
    crimeType: 'অপরাধের ধরন',
    timeFilter: 'সময় ফিল্টার',
    timeFilterActive: 'সময় ফিল্টার সক্রিয়',
    allTypes: 'সবগুলো',
    
    // Time periods
    allTime: 'সব সময়',
    morning: 'সকাল (৬-১২টা)',
    noon: 'দুপুর (১২-৩টা)',
    afternoon: 'বিকাল (৩-৬টা)',
    evening: 'সন্ধ্যা (৬-৮টা)',
    night: 'রাত (৮-১২টা)',
    midnight: 'মধ্যরাত (১২-৬টা)',
    dawn: 'ভোর (৪-৬টা)',
    unknown: 'অজানা',
    
    // Crime types
    murder: 'হত্যা',
    rape: 'ধর্ষণ',
    robbery: 'ডাকাতি',
    kidnapping: 'অপহরণ',
    drugs: 'মাদক',
    others: 'অন্যান্য',
    
    // Stats
    totalLocations: 'মোট অবস্থান',
    totalCases: 'মোট মামলা',
    highRisk: 'উচ্চ ঝুঁকিপূর্ণ',
    critical: 'সবচেয়ে ঝুঁকিপূর্ণ',
    high: 'উচ্চ ঝুঁকি',
    medium: 'মাঝারি ঝুঁকি',
    low: 'নিম্ন ঝুঁকি',
    normal: 'স্বাভাবিক',
    
    // Sidebar
    bangladeshCrimeMap: 'বাংলাদেশ অপরাধ মানচিত্র',
    district: 'জেলা',
    heatmap: 'তাপমান',
    timeline: 'সময়রেখা',
    list: 'তালিকা',
    byCases: 'মামলা অনুযায়ী সাজানো',
    totalDistricts: 'মোট {count}টি জেলা',
    locations: 'টি স্থান',
    cases: 'টি মামলা',
    recentEvents: 'সাম্প্রতিক ঘটনা',
    moreEvents: '+ {count}টি আরও ঘটনা...',
    
    // Risk level labels
    riskLevel: 'ঝুঁকির মাত্রা',
    byRiskLevel: 'ঝুঁকির মাত্রা অনুযায়ী',
    criticalRisk: 'অতি উচ্চ',
    highRiskLabel: 'উচ্চ',        // Changed from highRisk to highRiskLabel
    mediumRisk: 'মাঝারি',
    lowRisk: 'নিম্ন',
    
    // Hotspot
    hotspot: 'সবচেয়ে ঝুঁকিপূর্ণ এলাকা',
    
    // Map
    location: 'অবস্থান',
    latitude: 'অক্ষাংশ',
    longitude: 'দ্রাঘিমা',
    date: 'তারিখ',
    time: 'সময়',
    confidence: 'আত্মবিশ্বাস',
    details: 'বিস্তারিত জানতে ক্লিক করুন',
    lastUpdated: 'সর্বশেষ আপডেট',
    alert: 'এলার্ট',
    
    // Buttons
    resetFilters: 'সব ফিল্টার রিসেট করুন',
    showList: 'তালিকা দেখান',
    close: 'বন্ধ',
    
    // Filters
    filters: 'ফিল্টার',
    statistics: 'পরিসংখ্যান',
    
    // Quick stats
    quickStats: 'দ্রুত পরিসংখ্যান',
    totalEvents: 'মোট ঘটনা',
    
    // Time periods in filter
    timePeriods: {
      "সব সময়": 'সব সময়',
      "সকাল": 'সকাল (৬-১২টা)',
      "দুপুর": 'দুপুর (১২-৩টা)',
      "বিকাল": 'বিকাল (৩-৬টা)',
      "সন্ধ্যা": 'সন্ধ্যা (৬-৮টা)',
      "রাত": 'রাত (৮-১২টা)',
      "মধ্যরাত": 'মধ্যরাত (১২-৬টা)',
      "ভোর": 'ভোর (৪-৬টা)',
      "অজানা": 'অজানা'
    },
    
    // Period names
    periodNames: {
      "সব সময়": "সব সময়",
      "সকাল": "সকাল",
      "দুপুর": "দুপুর",
      "বিকাল": "বিকাল",
      "সন্ধ্যা": "সন্ধ্যা",
      "রাত": "রাত",
      "মধ্যরাত": "মধ্যরাত",
      "ভোর": "ভোর",
      "অজানা": "অজানা"
    }
  },
  
  [LANGUAGES.EN]: {
    // App
    appName: 'DANGERZONE',
    appSubtitle: 'Bangladesh - Crime Map',
    
    // Header
    searchPlaceholder: 'Search area or crime type...',
    crimeType: 'Crime Type',
    timeFilter: 'Time Filter',
    timeFilterActive: 'Time Filter Active',
    allTypes: 'All',
    
    // Time periods
    allTime: 'All Time',
    morning: 'Morning (6am-12pm)',
    noon: 'Noon (12pm-3pm)',
    afternoon: 'Afternoon (3pm-6pm)',
    evening: 'Evening (6pm-8pm)',
    night: 'Night (8pm-12am)',
    midnight: 'Midnight (12am-6am)',
    dawn: 'Dawn (4am-6am)',
    unknown: 'Unknown',
    
    // Crime types
    murder: 'Murder',
    rape: 'Rape',
    robbery: 'Robbery',
    kidnapping: 'Kidnapping',
    drugs: 'Drugs',
    others: 'Others',
    
    // Stats
    totalLocations: 'Total Locations',
    totalCases: 'Total Cases',
    highRisk: 'High Risk',
    critical: 'Critical',
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    normal: 'Normal',
    
    // Sidebar
    bangladeshCrimeMap: 'Bangladesh Crime Map',
    district: 'District',
    heatmap: 'Heatmap',
    timeline: 'Timeline',
    list: 'List',
    byCases: 'Sorted by cases',
    totalDistricts: 'Total {count} districts',
    locations: ' locations',
    cases: ' cases',
    recentEvents: 'Recent Events',
    moreEvents: '+ {count} more events...',
    
    // Risk level labels
    riskLevel: 'Risk Level',
    byRiskLevel: 'By Risk Level',
    criticalRisk: 'Critical',
    highRiskLabel: 'High',         // Changed from highRisk to highRiskLabel
    mediumRisk: 'Medium',
    lowRisk: 'Low',
    
    // Hotspot
    hotspot: 'Hotspot Area',
    
    // Map
    location: 'Location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    date: 'Date',
    time: 'Time',
    confidence: 'Confidence',
    details: 'Click for details',
    lastUpdated: 'Last Updated',
    alert: 'ALERT',
    
    // Buttons
    resetFilters: 'Reset All Filters',
    showList: 'Show List',
    close: 'Close',
    
    // Filters
    filters: 'Filters',
    statistics: 'Statistics',
    
    // Quick stats
    quickStats: 'Quick Statistics',
    totalEvents: 'Total Events',
    
    // Time periods in filter
    timePeriods: {
      "সব সময়": 'All Time',
      "সকাল": 'Morning (6am-12pm)',
      "দুপুর": 'Noon (12pm-3pm)',
      "বিকাল": 'Afternoon (3pm-6pm)',
      "সন্ধ্যা": 'Evening (6pm-8pm)',
      "রাত": 'Night (8pm-12am)',
      "মধ্যরাত": 'Midnight (12am-6am)',
      "ভোর": 'Dawn (4am-6am)',
      "অজানা": 'Unknown'
    },
    
    // Period names
    periodNames: {
      "সব সময়": "All Time",
      "সকাল": "Morning",
      "দুপুর": "Noon",
      "বিকাল": "Afternoon",
      "সন্ধ্যা": "Evening",
      "রাত": "Night",
      "মধ্যরাত": "Midnight",
      "ভোর": "Dawn",
      "অজানা": "Unknown"
    }
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Default to English, but check localStorage for saved preference
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('language');
      return saved || LANGUAGES.EN;
    } catch (e) {
      return LANGUAGES.EN;
    }
  });

  // Save to localStorage when language changes
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === LANGUAGES.BN ? LANGUAGES.EN : LANGUAGES.BN);
  };

  const setLanguageDirect = (lang) => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setLanguage(lang);
    }
  };

  const t = (key, params = {}) => {
    try {
      let text = TRANSLATIONS[language][key];
      
      // If key not found in current language, try English
      if (text === undefined) {
        text = TRANSLATIONS[LANGUAGES.EN][key];
      }
      
      // If still not found, try Bengali as last resort
      if (text === undefined) {
        text = TRANSLATIONS[LANGUAGES.BN][key];
      }
      
      // If still not found, return the key
      if (text === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      
      // Replace parameters in the text
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      });
      
      return text;
    } catch (e) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguageDirect, t }}>
      {children}
    </LanguageContext.Provider>
  );
};