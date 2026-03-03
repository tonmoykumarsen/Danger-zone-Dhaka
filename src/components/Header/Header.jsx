// components/Header/Header.js (updated with theme)
import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import SearchInput from "../UI/SearchInput";
import FilterButtons from "../UI/FilterButtons";
import TimePeriodDropdown from "../UI/TimePeriodDropdown";
import AdvancedFilterPanel from "../UI/AdvancedFilterPanel";
import HamburgerMenu from "../Layout/HamburgerMenu";
import LanguageToggle from "../UI/LanguageToggle";
import ThemeToggle from "../UI/ThemeToggle";
import { CRIME_TYPE_FILTERS, TIME_PERIODS } from "../../constants/config";

const Header = ({ 
  search, 
  onSearchChange, 
  currentCrimeTypeFilter,
  onCrimeTypeFilterChange,
  currentTimePeriodFilter,
  onTimePeriodFilterChange,
  areaName,
  statistics,
  advancedFilters = {
    crimeTypes: [],
    timePeriods: [],
    dateRange: { start: null, end: null },
    locations: [],
    riskLevels: [],
    quantityRange: { min: 0, max: 1000 },
    confidenceRange: { min: 0, max: 1 }
  },
  onAdvancedFilterChange = () => {},
  locations = [],
  activeFilterCount = 0,
  showAdvancedFilters = false,
  setShowAdvancedFilters = () => {}
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile View
  if (isMobile) {
    return (
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        position: "relative",
        zIndex: 1100
      }}>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue',cursive",
            fontSize: 20,
            letterSpacing: 1,
            color: colors.accent.red,
            textShadow: `0 0 18px ${colors.accent.red}88`,
            lineHeight: 1
          }}>
            ⚠ {t('appName')}
          </div>
          <div style={{
            fontSize: 8,
            color: colors.text.muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 1
          }}>
            {areaName}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ThemeToggle />
          <LanguageToggle />
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={t('searchPlaceholder')}
            compact={true}
          />
          <HamburgerMenu
            crimeTypeFilter={currentCrimeTypeFilter}
            onCrimeTypeFilterChange={onCrimeTypeFilterChange}
            timePeriodFilter={currentTimePeriodFilter}
            onTimePeriodFilterChange={onTimePeriodFilterChange}
            crimeTypeFilters={CRIME_TYPE_FILTERS}
            timePeriods={TIME_PERIODS}
            statistics={statistics}
          />
        </div>

        {/* Advanced Filters Panel for Mobile */}
        {showAdvancedFilters && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAdvancedFilters(false)}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <AdvancedFilterPanel
                filters={advancedFilters}
                onFilterChange={onAdvancedFilterChange}
                onClose={() => setShowAdvancedFilters(false)}
                locations={locations}
              />
            </div>
          </div>
        )}
      </header>
    );
  }

  // Desktop View
  return (
    <header style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "12px 18px",
      background: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      flexShrink: 0,
      position: "relative",
      zIndex: 1100
    }}>
      {/* Top Row - Logo, Search, and Action Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap"
      }}>
        {/* Logo and Theme/Language Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue',cursive",
              fontSize: 24,
              letterSpacing: 2,
              color: colors.accent.red,
              textShadow: `0 0 18px ${colors.accent.red}88`,
              lineHeight: 1
            }}>
              ⚠ {t('appName')}
            </div>
            <div style={{
              fontSize: 9.5,
              color: colors.text.muted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 1
            }}>
              {t('appSubtitle')}
            </div>
          </div>
          <ThemeToggle />
          <LanguageToggle />
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={t('searchPlaceholder')}
          />
        </div>

        {/* Filter Buttons Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Time Filter Toggle Button */}
          <button
            onClick={() => setShowTimeFilters(!showTimeFilters)}
            style={{
              padding: "8px 16px",
              background: showTimeFilters ? `${colors.accent.red}22` : colors.surface2,
              border: `1px solid ${showTimeFilters ? colors.accent.red + '66' : colors.border}`,
              borderRadius: "8px",
              color: showTimeFilters ? colors.accent.red : colors.text.secondary,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            <span>⏰</span>
            <span>{showTimeFilters ? t('timeFilterActive') : t('timeFilter')}</span>
            {currentTimePeriodFilter !== "সব সময়" && !showTimeFilters && (
              <span style={{
                width: "8px",
                height: "8px",
                background: colors.accent.red,
                borderRadius: "50%",
                marginLeft: "4px"
              }} />
            )}
          </button>

          {/* Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              padding: "8px 16px",
              background: showAdvancedFilters ? `${colors.accent.red}22` : colors.surface2,
              border: `1px solid ${showAdvancedFilters ? colors.accent.red + '66' : colors.border}`,
              borderRadius: "8px",
              color: showAdvancedFilters ? colors.accent.red : colors.text.secondary,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
              position: "relative",
              whiteSpace: "nowrap"
            }}
          >
            <span>🔍</span>
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && !showAdvancedFilters && (
              <span style={{
                background: colors.accent.red,
                color: "white",
                borderRadius: "12px",
                padding: "2px 6px",
                fontSize: "9px",
                fontWeight: 600,
                marginLeft: "4px"
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Second Row - Crime Type Filters */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        paddingTop: "4px"
      }}>
        <span style={{
          fontSize: "11px",
          color: colors.text.muted,
          fontWeight: 600,
          textTransform: "uppercase",
          whiteSpace: "nowrap"
        }}>
          {t('crimeType')}:
        </span>
        <FilterButtons
          filters={CRIME_TYPE_FILTERS}
          currentFilter={currentCrimeTypeFilter}
          onFilterChange={onCrimeTypeFilterChange}
        />
      </div>

      {/* Third Row - Time Filters (Conditional) */}
      {showTimeFilters && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          paddingTop: "8px",
          borderTop: `1px solid ${colors.border}`,
          marginTop: "4px"
        }}>
          <span style={{
            fontSize: "11px",
            color: colors.text.muted,
            fontWeight: 600,
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          }}>
            {t('time')}:
          </span>
          <TimePeriodDropdown
            currentFilter={currentTimePeriodFilter}
            onFilterChange={onTimePeriodFilterChange}
          />
          
          {/* Active Time Filter Indicator */}
          {currentTimePeriodFilter !== "সব সময়" && (
            <div style={{
              background: `${colors.accent.red}22`,
              border: `1px solid ${colors.accent.red}44`,
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "10px",
              color: colors.accent.red,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>⏰</span>
              <span style={{ fontWeight: 600 }}>{currentTimePeriodFilter}</span>
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '80px',
          pointerEvents: 'none'
        }}
        onClick={() => setShowAdvancedFilters(false)}
        >
          <div style={{ 
            position: 'relative',
            pointerEvents: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <AdvancedFilterPanel
              filters={advancedFilters}
              onFilterChange={onAdvancedFilterChange}
              onClose={() => setShowAdvancedFilters(false)}
              locations={locations}
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {!showAdvancedFilters && activeFilterCount > 0 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          padding: "8px 12px",
          background: colors.surface2,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          marginTop: "4px",
          position: "relative",
          zIndex: 100
        }}>
          <span style={{
            fontSize: "10px",
            color: colors.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <span>🎯</span>
            <span>Active Filters:</span>
          </span>
          
          {/* Crime Type Chips */}
          {advancedFilters?.crimeTypes?.map(type => (
            <span key={type} style={{
              padding: "4px 8px",
              background: `${colors.accent.red}22`,
              border: `1px solid ${colors.accent.red}44`,
              borderRadius: "16px",
              fontSize: "10px",
              color: colors.accent.red,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>🔫</span>
              <span>{type}</span>
              <button
                onClick={() => {
                  const newTypes = advancedFilters.crimeTypes.filter(t => t !== type);
                  onAdvancedFilterChange({ ...advancedFilters, crimeTypes: newTypes });
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.accent.red,
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "0 2px"
                }}
              >
                ×
              </button>
            </span>
          ))}

          {/* Time Period Chips */}
          {advancedFilters?.timePeriods?.map(period => {
            const periodInfo = TIME_PERIODS.find(p => p.value === period);
            return (
              <span key={period} style={{
                padding: "4px 8px",
                background: `${periodInfo?.color}22`,
                border: `1px solid ${periodInfo?.color}44`,
                borderRadius: "16px",
                fontSize: "10px",
                color: periodInfo?.color,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span>{periodInfo?.icon}</span>
                <span>{periodInfo?.label}</span>
                <button
                  onClick={() => {
                    const newPeriods = advancedFilters.timePeriods.filter(p => p !== period);
                    onAdvancedFilterChange({ ...advancedFilters, timePeriods: newPeriods });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: periodInfo?.color,
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "0 2px"
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}

          {/* Location Chips */}
          {advancedFilters?.locations?.slice(0, 3).map(location => (
            <span key={location} style={{
              padding: "4px 8px",
              background: `${colors.accent.blue}22`,
              border: `1px solid ${colors.accent.blue}44`,
              borderRadius: "16px",
              fontSize: "10px",
              color: colors.accent.blue,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>📍</span>
              <span>{location}</span>
              <button
                onClick={() => {
                  const newLocations = advancedFilters.locations.filter(l => l !== location);
                  onAdvancedFilterChange({ ...advancedFilters, locations: newLocations });
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.accent.blue,
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "0 2px"
                }}
              >
                ×
              </button>
            </span>
          ))}
          {advancedFilters?.locations?.length > 3 && (
            <span style={{
              fontSize: "10px",
              color: colors.text.muted
            }}>
              +{advancedFilters.locations.length - 3} more
            </span>
          )}

          {/* Risk Level Chips */}
          {advancedFilters?.riskLevels?.map(risk => {
            const riskConfig = {
              critical: { color: colors.risk.critical, emoji: "🔥", label: "Critical" },
              high: { color: colors.risk.high, emoji: "⚠️", label: "High" },
              medium: { color: colors.risk.medium, emoji: "⚡", label: "Medium" },
              low: { color: colors.risk.low, emoji: "✅", label: "Low" },
              normal: { color: colors.risk.normal, emoji: "ℹ️", label: "Normal" }
            }[risk];
            
            return (
              <span key={risk} style={{
                padding: "4px 8px",
                background: `${riskConfig?.color}22`,
                border: `1px solid ${riskConfig?.color}44`,
                borderRadius: "16px",
                fontSize: "10px",
                color: riskConfig?.color,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span>{riskConfig?.emoji}</span>
                <span>{riskConfig?.label}</span>
                <button
                  onClick={() => {
                    const newRisks = advancedFilters.riskLevels.filter(r => r !== risk);
                    onAdvancedFilterChange({ ...advancedFilters, riskLevels: newRisks });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: riskConfig?.color,
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "0 2px"
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}

          {/* Clear All Button */}
          <button
            onClick={() => onAdvancedFilterChange({
              crimeTypes: [],
              timePeriods: [],
              dateRange: { start: null, end: null },
              locations: [],
              riskLevels: [],
              quantityRange: { min: 0, max: 1000 },
              confidenceRange: { min: 0, max: 1 }
            })}
            style={{
              padding: "4px 8px",
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: "16px",
              fontSize: "10px",
              color: colors.text.secondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>🗑️</span>
            <span>Clear All</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;