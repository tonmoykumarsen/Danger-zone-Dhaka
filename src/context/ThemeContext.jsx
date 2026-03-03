// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || THEMES.LIGHT; // Default to light
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update body class for global styles
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
  };

  // Theme colors for light and dark modes
  const colors = {
    [THEMES.LIGHT]: {
      background: '#f8fafc',
      surface: '#ffffff',
      surface2: '#f1f5f9',
      surface3: '#e2e8f0',
      border: '#cbd5e1',
      border2: '#94a3b8',
      text: {
        primary: '#0f172a',
        secondary: '#334155',
        tertiary: '#475569',
        muted: '#64748b'
      },
      accent: {
        red: '#dc2626',
        orange: '#ea580c',
        yellow: '#ca8a04',
        green: '#16a34a',
        blue: '#2563eb',
        purple: '#7c3aed'
      },
      risk: {
        critical: '#dc2626',
        high: '#ea580c',
        medium: '#ca8a04',
        low: '#16a34a',
        normal: '#2563eb'
      },
      mapLegend: 'rgba(255,255,255,0.9)',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    [THEMES.DARK]: {
      background: '#0a0a14',
      surface: '#0f0f1a',
      surface2: '#1a1a2a',
      surface3: '#1e1e30',
      border: '#1e1e30',
      border2: '#2d2d40',
      text: {
        primary: '#f1f5f9',
        secondary: '#e2e8f0',
        tertiary: '#cbd5e1',
        muted: '#94a3b8'
      },
      accent: {
        red: '#ff2d2d',
        orange: '#ff6b1a',
        yellow: '#f0a500',
        green: '#22c55e',
        blue: '#3b82f6',
        purple: '#a78bfa'
      },
      risk: {
        critical: '#ff2d2d',
        high: '#ff6b1a',
        medium: '#f0a500',
        low: '#22c55e',
        normal: '#3b82f6'
      },
      mapLegend: 'rgba(15,15,26,0.9)',
      shadow: '0 8px 30px rgba(0, 0, 0, 0.8)'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: colors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};