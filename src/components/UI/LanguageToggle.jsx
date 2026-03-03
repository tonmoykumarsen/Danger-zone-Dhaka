// components/UI/LanguageToggle.js (updated with theme)
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { LANGUAGES } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const { colors } = useTheme();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '6px 12px',
        background: colors.surface2,
        border: `1px solid ${language === LANGUAGES.EN ? colors.accent.red + '66' : colors.border}`,
        borderRadius: '20px',
        color: language === LANGUAGES.EN ? colors.accent.red : colors.text.secondary,
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        minWidth: '80px',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.surface3;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.surface2;
      }}
    >
      <span style={{ fontSize: '14px' }}>{language === LANGUAGES.EN ? '🇬🇧' : '🇧🇩'}</span>
      <span>{language === LANGUAGES.EN ? 'English' : 'বাংলা'}</span>
    </button>
  );
};

export default LanguageToggle;