// components/UI/AdvancedFilterPanel.js (updated with theme)
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { CRIME_TYPE_FILTERS, TIME_PERIODS } from '../../constants/config';

const AdvancedFilterPanel = ({ 
  filters = {
    crimeTypes: [],
    timePeriods: [],
    dateRange: { start: null, end: null },
    locations: [],
    riskLevels: [],
    quantityRange: { min: 0, max: 1000 },
    confidenceRange: { min: 0, max: 1 }
  }, 
  onFilterChange, 
  onClose,
  locations = [] 
}) => {
  const { language } = useLanguage();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('crime');

  const handleCrimeTypeToggle = (type) => {
    const currentTypes = filters.crimeTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ ...filters, crimeTypes: newTypes });
  };

  const handleTimePeriodToggle = (period) => {
    const currentPeriods = filters.timePeriods || [];
    const newPeriods = currentPeriods.includes(period)
      ? currentPeriods.filter(p => p !== period)
      : [...currentPeriods, period];
    onFilterChange({ ...filters, timePeriods: newPeriods });
  };

  const handleLocationToggle = (location) => {
    const currentLocations = filters.locations || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location];
    onFilterChange({ ...filters, locations: newLocations });
  };

  const handleRiskLevelToggle = (level) => {
    const currentLevels = filters.riskLevels || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];
    onFilterChange({ ...filters, riskLevels: newLevels });
  };

  const handleQuantityChange = (min, max) => {
    onFilterChange({ 
      ...filters, 
      quantityRange: { 
        min: min !== undefined ? min : (filters.quantityRange?.min || 0), 
        max: max !== undefined ? max : (filters.quantityRange?.max || 1000)
      } 
    });
  };

  const handleDateChange = (start, end) => {
    onFilterChange({ 
      ...filters, 
      dateRange: { 
        start: start !== undefined ? start : (filters.dateRange?.start || null), 
        end: end !== undefined ? end : (filters.dateRange?.end || null)
      } 
    });
  };

  const handleConfidenceChange = (min, max) => {
    onFilterChange({ 
      ...filters, 
      confidenceRange: { 
        min: min !== undefined ? min : (filters.confidenceRange?.min || 0), 
        max: max !== undefined ? max : (filters.confidenceRange?.max || 1)
      } 
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      crimeTypes: [],
      timePeriods: [],
      dateRange: { start: null, end: null },
      locations: [],
      riskLevels: [],
      quantityRange: { min: 0, max: 1000 },
      confidenceRange: { min: 0, max: 1 }
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.crimeTypes?.length) count += filters.crimeTypes.length;
    if (filters.timePeriods?.length) count += filters.timePeriods.length;
    if (filters.locations?.length) count += filters.locations.length;
    if (filters.riskLevels?.length) count += filters.riskLevels.length;
    if (filters.dateRange?.start || filters.dateRange?.end) count++;
    if ((filters.quantityRange?.min || 0) > 0 || (filters.quantityRange?.max || 1000) < 1000) count++;
    if ((filters.confidenceRange?.min || 0) > 0 || (filters.confidenceRange?.max || 1) < 1) count++;
    return count;
  };

  const riskLevels = [
    { value: 'critical', label: language === 'bn' ? 'সবচেয়ে ঝুঁকিপূর্ণ' : 'Critical', color: colors.risk.critical, emoji: "🔥" },
    { value: 'high', label: language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High', color: colors.risk.high, emoji: "⚠️" },
    { value: 'medium', label: language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium', color: colors.risk.medium, emoji: "⚡" },
    { value: 'low', label: language === 'bn' ? 'নিম্ন ঝুঁকি' : 'Low', color: colors.risk.low, emoji: "✅" },
    { value: 'normal', label: language === 'bn' ? 'স্বাভাবিক' : 'Normal', color: colors.risk.normal, emoji: "ℹ️" }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      right: '20px',
      width: '380px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      overflowY: 'auto',
      background: colors.surface2,
      border: `1px solid ${colors.accent.red}66`,
      borderRadius: '12px',
      padding: '16px',
      zIndex: 2000,
      boxShadow: colors.shadow,
      animation: 'slideDown 0.2s ease'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '12px'
      }}>
        <h3 style={{ fontSize: '14px', color: colors.text.primary, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔍</span>
          <span>{language === 'bn' ? 'উন্নত ফিল্টার' : 'Advanced Filters'}</span>
          {getActiveFilterCount() > 0 && (
            <span style={{
              background: colors.accent.red,
              color: 'white',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {getActiveFilterCount()}
            </span>
          )}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.text.secondary,
            cursor: 'pointer',
            fontSize: '18px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = colors.surface3}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          ✕
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '16px',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '8px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'crime', label: language === 'bn' ? 'অপরাধ' : 'Crime', icon: '🔫' },
          { id: 'time', label: language === 'bn' ? 'সময়' : 'Time', icon: '⏰' },
          { id: 'location', label: language === 'bn' ? 'অবস্থান' : 'Location', icon: '📍' },
          { id: 'risk', label: language === 'bn' ? 'ঝুঁকি' : 'Risk', icon: '⚠️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 12px',
              background: activeTab === tab.id ? `${colors.accent.red}22` : 'transparent',
              border: `1px solid ${activeTab === tab.id ? colors.accent.red + '66' : colors.border}`,
              borderRadius: '20px',
              color: activeTab === tab.id ? colors.accent.red : colors.text.secondary,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Crime Type Filters */}
      {activeTab === 'crime' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{language === 'bn' ? 'অপরাধের ধরন নির্বাচন করুন:' : 'Select crime types:'}</span>
              {filters.crimeTypes?.length > 0 && (
                <span style={{ color: colors.accent.red }}>{filters.crimeTypes.length} selected</span>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px'
            }}>
              {CRIME_TYPE_FILTERS.filter(f => f !== 'সবগুলো').map(type => {
                const isSelected = filters.crimeTypes?.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleCrimeTypeToggle(type)}
                    style={{
                      padding: '8px',
                      background: isSelected ? `${colors.accent.red}22` : colors.surface,
                      border: `1px solid ${isSelected ? colors.accent.red + '66' : colors.border}`,
                      borderRadius: '6px',
                      color: isSelected ? colors.accent.red : colors.text.secondary,
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface3;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface;
                    }}
                  >
                    <span>{type}</span>
                    {isSelected && <span style={{ color: colors.accent.red }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Time Period Filters */}
      {activeTab === 'time' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{language === 'bn' ? 'সময় নির্বাচন করুন:' : 'Select time periods:'}</span>
              {filters.timePeriods?.length > 0 && (
                <span style={{ color: colors.accent.red }}>{filters.timePeriods.length} selected</span>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px'
            }}>
              {TIME_PERIODS.filter(p => p.value !== 'সব সময়').map(period => {
                const isSelected = filters.timePeriods?.includes(period.value);
                return (
                  <button
                    key={period.value}
                    onClick={() => handleTimePeriodToggle(period.value)}
                    style={{
                      padding: '8px',
                      background: isSelected ? `${period.color}22` : colors.surface,
                      border: `1px solid ${isSelected ? period.color + '66' : colors.border}`,
                      borderRadius: '6px',
                      color: isSelected ? period.color : colors.text.secondary,
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface3;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface;
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{period.icon}</span>
                      <span>{period.label}</span>
                    </span>
                    {isSelected && <span style={{ color: period.color }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px'
            }}>
              {language === 'bn' ? 'তারিখের সীমা:' : 'Date range:'}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="date"
                placeholder={language === 'bn' ? 'শুরু' : 'Start'}
                value={filters.dateRange?.start || ''}
                onChange={(e) => handleDateChange(e.target.value, filters.dateRange?.end)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.text.primary,
                  fontSize: '11px',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="date"
                placeholder={language === 'bn' ? 'শেষ' : 'End'}
                value={filters.dateRange?.end || ''}
                onChange={(e) => handleDateChange(filters.dateRange?.start, e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.text.primary,
                  fontSize: '11px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Location Filters */}
      {activeTab === 'location' && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{language === 'bn' ? 'অবস্থান নির্বাচন করুন:' : 'Select locations:'}</span>
              {filters.locations?.length > 0 && (
                <span style={{ color: colors.accent.red }}>{filters.locations.length} selected</span>
              )}
            </div>
            <div style={{
              maxHeight: '250px',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              padding: '4px'
            }}>
              {locations?.slice(0, 30).map(location => {
                const isSelected = filters.locations?.includes(location);
                return (
                  <button
                    key={location}
                    onClick={() => handleLocationToggle(location)}
                    style={{
                      padding: '6px',
                      background: isSelected ? `${colors.accent.blue}22` : colors.surface,
                      border: `1px solid ${isSelected ? colors.accent.blue + '66' : colors.border}`,
                      borderRadius: '4px',
                      color: isSelected ? colors.accent.blue : colors.text.secondary,
                      fontSize: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface3;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface;
                    }}
                  >
                    <span>{location}</span>
                    {isSelected && <span style={{ color: colors.accent.blue }}>✓</span>}
                  </button>
                );
              })}
            </div>
            {locations?.length > 30 && (
              <div style={{
                fontSize: '10px',
                color: colors.text.muted,
                textAlign: 'center',
                marginTop: '8px'
              }}>
                + {locations.length - 30} {language === 'bn' ? 'টি আরও অবস্থান' : 'more locations'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Risk Level Filters */}
      {activeTab === 'risk' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{language === 'bn' ? 'ঝুঁকির মাত্রা নির্বাচন করুন:' : 'Select risk levels:'}</span>
              {filters.riskLevels?.length > 0 && (
                <span style={{ color: colors.accent.red }}>{filters.riskLevels.length} selected</span>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px'
            }}>
              {riskLevels.map(risk => {
                const isSelected = filters.riskLevels?.includes(risk.value);
                return (
                  <button
                    key={risk.value}
                    onClick={() => handleRiskLevelToggle(risk.value)}
                    style={{
                      padding: '8px',
                      background: isSelected ? `${risk.color}22` : colors.surface,
                      border: `1px solid ${isSelected ? risk.color + '66' : colors.border}`,
                      borderRadius: '6px',
                      color: isSelected ? risk.color : colors.text.secondary,
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface3;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = colors.surface;
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{risk.emoji}</span>
                      <span>{risk.label}</span>
                    </span>
                    {isSelected && <span style={{ color: risk.color }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Range */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{language === 'bn' ? 'মামলার সংখ্যা:' : 'Case quantity:'}</span>
              <span style={{ color: colors.risk.low }}>
                {filters.quantityRange?.min || 0} - {filters.quantityRange?.max || 1000}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.min(filters.quantityRange?.max || 100, 100)}
              onChange={(e) => handleQuantityChange(filters.quantityRange?.min, parseInt(e.target.value))}
              style={{ width: '100%', marginBottom: '8px', accentColor: colors.risk.low }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.quantityRange?.min || 0}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0, filters.quantityRange?.max)}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.text.primary,
                  fontSize: '11px'
                }}
              />
              <span style={{ color: colors.text.muted, alignSelf: 'center' }}>to</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.quantityRange?.max || 1000}
                onChange={(e) => handleQuantityChange(filters.quantityRange?.min, parseInt(e.target.value) || 1000)}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.text.primary,
                  fontSize: '11px'
                }}
              />
            </div>
          </div>

          {/* Confidence Range */}
          <div>
            <div style={{
              fontSize: '11px',
              color: colors.text.secondary,
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{language === 'bn' ? 'আত্মবিশ্বাস:' : 'Confidence:'}</span>
              <span style={{ color: colors.accent.blue }}>
                {Math.round((filters.confidenceRange?.min || 0) * 100)}% - {Math.round((filters.confidenceRange?.max || 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={(filters.confidenceRange?.max || 1) * 100}
              onChange={(e) => handleConfidenceChange(
                filters.confidenceRange?.min,
                parseInt(e.target.value) / 100
              )}
              style={{ width: '100%', accentColor: colors.accent.blue }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round((filters.confidenceRange?.min || 0) * 100)}
                onChange={(e) => handleConfidenceChange(
                  parseInt(e.target.value) / 100,
                  filters.confidenceRange?.max
                )}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.text.primary,
                  fontSize: '11px'
                }}
              />
              <span style={{ color: colors.text.muted, alignSelf: 'center' }}>%</span>
              <span style={{ color: colors.text.muted, alignSelf: 'center' }}>to</span>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round((filters.confidenceRange?.max || 1) * 100)}
                onChange={(e) => handleConfidenceChange(
                  filters.confidenceRange?.min,
                  parseInt(e.target.value) / 100
                )}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  color: colors.text.primary,
                  fontSize: '11px'
                }}
              />
              <span style={{ color: colors.text.muted, alignSelf: 'center' }}>%</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: `1px solid ${colors.border}`
      }}>
        <button
          onClick={clearAllFilters}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            color: colors.text.secondary,
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.surface3;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          <span>🗑️</span>
          <span>{language === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            background: `${colors.accent.red}22`,
            border: `1px solid ${colors.accent.red}66`,
            borderRadius: '6px',
            color: colors.accent.red,
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${colors.accent.red}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${colors.accent.red}22`;
          }}
        >
          <span>✓</span>
          <span>{language === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}</span>
        </button>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdvancedFilterPanel;