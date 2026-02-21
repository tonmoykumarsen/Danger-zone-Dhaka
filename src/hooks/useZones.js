import { useState, useMemo } from "react";
import { CRIME_DATA } from "../constants/data";
import { filterZones, enhanceZones } from "../utils/helpers";

export const useZones = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeZoneIndex, setActiveZoneIndex] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);

  const filteredZones = useMemo(() => 
    filterZones(CRIME_DATA.zones, filter, search),
    [filter, search]
  );

  // Enhanced zones for display (with typeConfig and risk)
  const enhancedZones = useMemo(() => 
    enhanceZones(filteredZones),
    [filteredZones]
  );

  const setActiveZone = (index) => {
    setActiveZoneIndex(prev => prev === index ? null : index);
  };

  const clearActiveZone = () => setActiveZoneIndex(null);
  
  const setHovered = (zone) => setHoveredZone(zone);
  const clearHovered = () => setHoveredZone(null);

  return {
    allZones: CRIME_DATA.zones,
    filteredZones: enhancedZones, // Return enhanced zones for components
    originalFilteredZones: filteredZones, // Original zones for calculations
    areaName: CRIME_DATA.area,
    filter,
    setFilter,
    search,
    setSearch,
    activeZoneIndex,
    setActiveZone,
    clearActiveZone,
    hoveredZone,
    setHovered,
    clearHovered,
  };
};