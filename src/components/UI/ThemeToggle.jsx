// components/UI/ThemeToggle.js
import React from 'react';
import { useTheme, THEMES } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 12px',
        background: colors.surface2,
        border: `1px solid ${colors.border}`,
        borderRadius: '20px',
        color: colors.text.primary,
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        minWidth: '90px',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.surface3;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.surface2;
      }}
    >
      <span style={{ fontSize: '14px' }}>
        {theme === THEMES.LIGHT ? '🌙' : '☀️'}
      </span>
      <span>
        {theme === THEMES.LIGHT ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;