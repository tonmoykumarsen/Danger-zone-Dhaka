import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGES } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '6px 12px',
        background: '#0f0f1a',
        border: `1px solid ${language === LANGUAGES.EN ? '#ff2d2d66' : '#1e1e30'}`,
        borderRadius: '20px',
        color: language === LANGUAGES.EN ? '#ff2d2d' : '#94a3b8',
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
        e.currentTarget.style.background = '#1a1a2a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#0f0f1a';
      }}
    >
      <span style={{ fontSize: '14px' }}>{language === LANGUAGES.EN ? '🇬🇧' : '🇧🇩'}</span>
      <span>{language === LANGUAGES.EN ? 'English' : 'বাংলা'}</span>
    </button>
  );
};

export default LanguageToggle;