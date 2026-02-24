import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import SearchInput from "../UI/SearchInput";
import FilterButtons from "../UI/FilterButtons";
import TimePeriodDropdown from "../UI/TimePeriodDropdown";
import AdvancedFilterPanel from "../UI/AdvancedFilterPanel";
import HamburgerMenu from "../Layout/HamburgerMenu";
import LanguageToggle from "../UI/LanguageToggle";
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
  onAdvancedFilterChange = () => {}, // Default empty function to prevent errors
  locations = [],
  activeFilterCount = 0
}) => {
  const { t, language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [showTimeFilters, setShowTimeFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
        background: "linear-gradient(180deg,#0d0d1c,#080810)",
        borderBottom: "1px solid #1a1a2e",
        position: "relative",
        zIndex: 1100
      }}>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue',cursive",
            fontSize: 20,
            letterSpacing: 1,
            color: "#ff2d2d",
            textShadow: "0 0 18px #ff2d2d88",
            lineHeight: 1
          }}>
            ⚠ {t('appName')}
          </div>
          <div style={{
            fontSize: 8,
            color: "#475569",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 1
          }}>
            {areaName}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            background: 'rgba(0,0,0,0.8)',
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
      background: "linear-gradient(180deg,#0d0d1c,#080810)",
      borderBottom: "1px solid #1a1a2e",
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
        {/* Logo and Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue',cursive",
              fontSize: 24,
              letterSpacing: 2,
              color: "#ff2d2d",
              textShadow: "0 0 18px #ff2d2d88",
              lineHeight: 1
            }}>
              ⚠ {t('appName')}
            </div>
            <div style={{
              fontSize: 9.5,
              color: "#475569",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 1
            }}>
              {t('appSubtitle')}
            </div>
          </div>
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
              background: showTimeFilters ? "#ff2d2d22" : "#0f0f1a",
              border: `1px solid ${showTimeFilters ? "#ff2d2d66" : "#1e1e30"}`,
              borderRadius: "8px",
              color: showTimeFilters ? "#ff2d2d" : "#94a3b8",
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
                background: "#ff2d2d",
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
              background: showAdvancedFilters ? "#ff2d2d22" : "#0f0f1a",
              border: `1px solid ${showAdvancedFilters ? "#ff2d2d66" : "#1e1e30"}`,
              borderRadius: "8px",
              color: showAdvancedFilters ? "#ff2d2d" : "#94a3b8",
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
                background: "#ff2d2d",
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
          color: "#64748b",
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
          borderTop: "1px solid #1a1a2e",
          marginTop: "4px"
        }}>
          <span style={{
            fontSize: "11px",
            color: "#64748b",
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
              background: "#ff2d2d22",
              border: "1px solid #ff2d2d44",
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "10px",
              color: "#ff2d2d",
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

      {/* Advanced Filters Panel - Positioned absolutely above everything */}
      {showAdvancedFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '80px'
        }}
        onClick={() => setShowAdvancedFilters(false)}
        >
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <AdvancedFilterPanel
              filters={advancedFilters}
              onFilterChange={onAdvancedFilterChange}
              onClose={() => setShowAdvancedFilters(false)}
              locations={locations}
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary (when advanced filters are active but panel closed) */}
      {!showAdvancedFilters && activeFilterCount > 0 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          padding: "8px 12px",
          background: "#0f0f1a",
          border: "1px solid #1e1e30",
          borderRadius: "8px",
          marginTop: "4px",
          position: "relative",
          zIndex: 100
        }}>
          <span style={{
            fontSize: "10px",
            color: "#94a3b8",
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
              background: "#ff2d2d22",
              border: "1px solid #ff2d2d44",
              borderRadius: "16px",
              fontSize: "10px",
              color: "#ff2d2d",
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
                  color: "#ff2d2d",
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

          {/* Location Chips (show first 3) */}
          {advancedFilters?.locations?.slice(0, 3).map(location => (
            <span key={location} style={{
              padding: "4px 8px",
              background: "#60a5fa22",
              border: "1px solid #60a5fa44",
              borderRadius: "16px",
              fontSize: "10px",
              color: "#60a5fa",
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
                  color: "#60a5fa",
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
              color: "#64748b"
            }}>
              +{advancedFilters.locations.length - 3} more
            </span>
          )}

          {/* Risk Level Chips */}
          {advancedFilters?.riskLevels?.map(risk => {
            const riskConfig = {
              critical: { color: "#ff2d2d", emoji: "🔥", label: "Critical" },
              high: { color: "#ff6b1a", emoji: "⚠️", label: "High" },
              medium: { color: "#f0a500", emoji: "⚡", label: "Medium" },
              low: { color: "#22c55e", emoji: "✅", label: "Low" },
              normal: { color: "#3b82f6", emoji: "ℹ️", label: "Normal" }
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

          {/* Quantity Range Chip */}
          {(advancedFilters?.quantityRange?.min > 0 || advancedFilters?.quantityRange?.max < 1000) && (
            <span style={{
              padding: "4px 8px",
              background: "#22c55e22",
              border: "1px solid #22c55e44",
              borderRadius: "16px",
              fontSize: "10px",
              color: "#22c55e",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>📊</span>
              <span>{advancedFilters.quantityRange.min} - {advancedFilters.quantityRange.max} cases</span>
              <button
                onClick={() => onAdvancedFilterChange({ 
                  ...advancedFilters, 
                  quantityRange: { min: 0, max: 1000 } 
                })}
                style={{
                  background: "none",
                  border: "none",
                  color: "#22c55e",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "0 2px"
                }}
              >
                ×
              </button>
            </span>
          )}

          {/* Date Range Chip */}
          {(advancedFilters?.dateRange?.start || advancedFilters?.dateRange?.end) && (
            <span style={{
              padding: "4px 8px",
              background: "#f0a50022",
              border: "1px solid #f0a50044",
              borderRadius: "16px",
              fontSize: "10px",
              color: "#f0a500",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>📅</span>
              <span>
                {advancedFilters.dateRange.start || 'Any'} - {advancedFilters.dateRange.end || 'Any'}
              </span>
              <button
                onClick={() => onAdvancedFilterChange({ 
                  ...advancedFilters, 
                  dateRange: { start: null, end: null } 
                })}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f0a500",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "0 2px"
                }}
              >
                ×
              </button>
            </span>
          )}

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
              border: "1px solid #1e1e30",
              borderRadius: "16px",
              fontSize: "10px",
              color: "#94a3b8",
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