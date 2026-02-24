import { useState, useMemo } from "react";
import { CRIME_DATA } from "../constants/data";
import { filterZones, enhanceZones, getStatistics, getTimePeriodStatistics } from "../utils/helpers";

export const useZones = () => {
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("সবগুলো");
  const [timePeriodFilter, setTimePeriodFilter] = useState("সব সময়");
  const [search, setSearch] = useState("");
  const [activeZoneIndex, setActiveZoneIndex] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [sortBy, setSortBy] = useState("quantity");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredZones = useMemo(() => 
    filterZones(CRIME_DATA.zones, crimeTypeFilter, timePeriodFilter, search),
    [crimeTypeFilter, timePeriodFilter, search]
  );

  const sortedZones = useMemo(() => {
    let sorted = [...filteredZones];
    
    switch(sortBy) {
      case "quantity":
        sorted.sort((a, b) => sortOrder === "desc" 
          ? b["Crime quantity"] - a["Crime quantity"]
          : a["Crime quantity"] - b["Crime quantity"]);
        break;
      case "date":
        sorted.sort((a, b) => {
          const dateA = a.dateObj || new Date(0);
          const dateB = b.dateObj || new Date(0);
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
        break;
      case "location":
        sorted.sort((a, b) => sortOrder === "desc"
          ? (b["Crime Location"] || "").localeCompare(a["Crime Location"] || "")
          : (a["Crime Location"] || "").localeCompare(b["Crime Location"] || ""));
        break;
      default:
        break;
    }
    
    return sorted;
  }, [filteredZones, sortBy, sortOrder]);

  const enhancedZones = useMemo(() => 
    enhanceZones(sortedZones),
    [sortedZones]
  );

  const statistics = useMemo(() => 
    getStatistics(filteredZones),
    [filteredZones]
  );

  const timePeriodStatistics = useMemo(() => 
    getTimePeriodStatistics(filteredZones),
    [filteredZones]
  );

  const setActiveZone = (index) => {
    setActiveZoneIndex(prev => prev === index ? null : index);
  };

  const clearActiveZone = () => setActiveZoneIndex(null);
  
  const setHovered = (zone) => setHoveredZone(zone);
  const clearHovered = () => setHoveredZone(null);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return {
    allZones: CRIME_DATA.zones,
    filteredZones: enhancedZones,
    originalFilteredZones: filteredZones,
    statistics,
    timePeriodStatistics,
    areaName: CRIME_DATA.area,
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
    clearHovered,
    sortBy,
    sortOrder,
    toggleSort
  };
};