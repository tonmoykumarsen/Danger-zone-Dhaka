// src/App.js
import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useZones } from "./hooks/useZones";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import CrimeMap from "./components/Map/CrimeMap";
import "./styles/global.css";

function AppContent() {
  const {
    filteredZones,
    statistics,
    timePeriodStatistics,
    areaName,
    crimeTypeFilter,
    setCrimeTypeFilter,
    timePeriodFilter,
    setTimePeriodFilter,
    search,
    setSearch,
    activeZoneIndex,
    setActiveZone,
    clearActiveZone,
    hoveredZone,
    setHovered,
    sortBy,
    sortOrder,
    toggleSort
  } = useZones();

  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    crimeTypes: [],
    timePeriods: [],
    dateRange: { start: null, end: null },
    locations: [],
    riskLevels: [],
    quantityRange: { min: 0, max: 1000 },
    confidenceRange: { min: 0, max: 1 }
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(filteredZones.map(z => z.main_area))].sort();

  // Calculate active filter count
  const activeFilterCount = 
    (advancedFilters.crimeTypes?.length || 0) +
    (advancedFilters.timePeriods?.length || 0) +
    (advancedFilters.locations?.length || 0) +
    (advancedFilters.riskLevels?.length || 0) +
    (advancedFilters.dateRange?.start || advancedFilters.dateRange?.end ? 1 : 0) +
    (advancedFilters.quantityRange?.min > 0 || advancedFilters.quantityRange?.max < 1000 ? 1 : 0) +
    (advancedFilters.confidenceRange?.min > 0 || advancedFilters.confidenceRange?.max < 1 ? 1 : 0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
    clearActiveZone();
  };

  const handleCrimeTypeFilterChange = (newFilter) => {
    setCrimeTypeFilter(newFilter);
    clearActiveZone();
  };

  const handleTimePeriodFilterChange = (newFilter) => {
    setTimePeriodFilter(newFilter);
    clearActiveZone();
  };

  const handleAdvancedFilterChange = (newFilters) => {
    setAdvancedFilters(newFilters);
    console.log('Advanced filters updated:', newFilters);
  };

  const handleZoneClick = (index) => {
    setActiveZone(index);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleZoneHover = (zone) => {
    setHovered(zone);
  };

  const activeZone = activeZoneIndex !== null ? filteredZones[activeZoneIndex] : null;

  return (
    <div className="app">
      <Header
        search={search}
        onSearchChange={handleSearchChange}
        currentCrimeTypeFilter={crimeTypeFilter}
        onCrimeTypeFilterChange={handleCrimeTypeFilterChange}
        currentTimePeriodFilter={timePeriodFilter}
        onTimePeriodFilterChange={handleTimePeriodFilterChange}
        areaName={areaName}
        statistics={statistics}
        advancedFilters={advancedFilters}
        onAdvancedFilterChange={handleAdvancedFilterChange}
        locations={uniqueLocations}
        activeFilterCount={activeFilterCount}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
      />

      <div className="main-container">
        {(showSidebar || !isMobile) && (
          <Sidebar
            zones={filteredZones}
            activeZoneIndex={activeZoneIndex}
            onZoneClick={handleZoneClick}
            onZoneHover={handleZoneHover}
            statistics={statistics}
            timePeriodStatistics={timePeriodStatistics}
            currentTimePeriodFilter={timePeriodFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
            onClose={isMobile ? () => setShowSidebar(false) : null}
          />
        )}

        <div className={`map-container ${showAdvancedFilters ? 'modal-open' : ''}`}>
          {isMobile && !showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                zIndex: 1000,
                padding: "8px 12px",
                background: "#1a1a2a",
                border: "1px solid #ff2d2d66",
                borderRadius: "8px",
                color: "#ff2d2d",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}
            >
              <span>📋</span>
              <span>Show List</span>
            </button>
          )}

          <CrimeMap
            zones={filteredZones}
            activeZone={activeZoneIndex}
            hoveredZone={hoveredZone}
            onZoneHover={handleZoneHover}
            onZoneClick={handleZoneClick}
            isModalOpen={showAdvancedFilters}
          />
          
          {activeZone && (
            <div className="active-zone-indicator">
              <span className="indicator-icon" style={{ color: activeZone.typeConfig.color }}>📍</span>
              <span className="indicator-text">
                <strong>{activeZone.main_area}</strong>
              </span>
              <span className="indicator-badge" style={{
                backgroundColor: `${activeZone.typeConfig.color}22`,
                color: activeZone.typeConfig.color,
                borderColor: `${activeZone.typeConfig.color}44`
              }}>
                {activeZone.typeConfig.icon} {activeZone.typeConfig.badge}
              </span>
              <span className="indicator-cases">
                {activeZone.quantity} {activeZone.quantity > 1 ? 'cases' : 'case'}
              </span>
              {activeZone.period && activeZone.period !== "অজানা" && (
                <span className="indicator-time">
                  {activeZone.period}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;