// components/UI/FilterButtons.js (updated with theme)
import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { getTypeConfig } from "../../utils/helpers";

const FilterButtons = ({ filters, currentFilter, onFilterChange }) => {
  const { language } = useLanguage();
  const { colors } = useTheme();

  // Get translated filter name
  const getTranslatedFilter = (filter) => {
    if (filter === "সবগুলো") {
      return language === 'bn' ? 'সবগুলো' : 'All';
    }
    
    const translationMap = {
      "হত্যা": language === 'bn' ? 'হত্যা' : 'Murder',
      "খুন": language === 'bn' ? 'খুন' : 'Murder',
      "ধর্ষণ": language === 'bn' ? 'ধর্ষণ' : 'Rape',
      "ডাকাতি": language === 'bn' ? 'ডাকাতি' : 'Robbery',
      "অপহরণ": language === 'bn' ? 'অপহরণ' : 'Kidnapping',
      "মাদক": language === 'bn' ? 'মাদক' : 'Drugs',
      "অন্যান্য": language === 'bn' ? 'অন্যান্য' : 'Others'
    };
    
    return translationMap[filter] || filter;
  };

  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {filters.map((filter) => {
        const config = filter === "সবগুলো" ? null : getTypeConfig(filter);
        const isActive = currentFilter === filter;
        const color = config?.color || colors.accent.blue;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 9.5,
              fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.07em", cursor: "pointer",
              border: `1px solid ${isActive ? color + '66' : colors.border}`,
              background: isActive ? `${color}22` : colors.surface2,
              color: isActive ? color : colors.text.secondary,
              boxShadow: isActive ? `0 0 8px ${color}44` : "none",
              transition: "all 0.15s",
              fontFamily: "'Hind Siliguri', 'DM Sans', system-ui, sans-serif"
            }}
          >
            {getTranslatedFilter(filter)}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;