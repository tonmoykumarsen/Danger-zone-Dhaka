import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import SearchInput from "../UI/SearchInput";
import FilterButtons from "../UI/FilterButtons";
import TimePeriodDropdown from "../UI/TimePeriodDropdown";
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
  statistics
}) => {
  const { t, language } = useLanguage();
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
        zIndex: 100
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
      </header>
    );
  }

  return (
    <header style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "12px 18px",
      background: "linear-gradient(180deg,#0d0d1c,#080810)",
      borderBottom: "1px solid #1a1a2e",
      flexShrink: 0
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap"
      }}>
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

        <div style={{ flex: 1, maxWidth: "400px" }}>
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={t('searchPlaceholder')}
          />
        </div>

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
            transition: "all 0.2s"
          }}
        >
          <span>⏰</span>
          <span>{showTimeFilters ? t('timeFilterActive') : t('timeFilter')}</span>
        </button>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        paddingTop: "8px",
        borderTop: showTimeFilters ? "1px solid #1a1a2e" : "none",
        marginTop: showTimeFilters ? "4px" : "0"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          flex: 1
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

        {showTimeFilters && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "200px"
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;