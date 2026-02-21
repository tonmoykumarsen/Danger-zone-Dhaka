import React from "react";
import { useZones } from "./hooks/useZones";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import CrimeMap from "./components/Map/CrimeMap";
import "./styles/global.css";

function App() {
  const {
    filteredZones,
    statistics,
    areaName,
    filter,
    setFilter,
    search,
    setSearch,
    activeZoneIndex,
    setActiveZone,
    clearActiveZone,
    hoveredZone,
    setHovered,
    // clearHovered,
    sortBy,
    sortOrder,
    toggleSort
  } = useZones();

  const handleSearchChange = (value) => {
    setSearch(value);
    clearActiveZone();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    clearActiveZone();
  };

  const handleZoneClick = (index) => {
    setActiveZone(index);
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
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        areaName={areaName}
      />

      <div className="main-container">
        <Sidebar
          zones={filteredZones}
          activeZoneIndex={activeZoneIndex}
          onZoneClick={handleZoneClick}
          onZoneHover={handleZoneHover}
          statistics={statistics}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />

        <div className="map-container">
          <CrimeMap
            zones={filteredZones}
            activeZone={activeZoneIndex}
            hoveredZone={hoveredZone}
            onZoneHover={handleZoneHover}
            onZoneClick={handleZoneClick}
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
                {activeZone.quantity} টি মামলা
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;