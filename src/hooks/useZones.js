// src/hooks/useZones.js
import { useState, useMemo } from "react";
import { filterZones, enhanceZones, getStatistics, getTimePeriodStatistics } from "../utils/helpers";
import { rawCrimeData } from "../constants/data";  // Updated path to constants/data.js

export const useZones = () => {
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("সবগুলো");
  const [timePeriodFilter, setTimePeriodFilter] = useState("সব সময়");
  const [search, setSearch] = useState("");
  const [activeZoneIndex, setActiveZoneIndex] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [sortBy, setSortBy] = useState("risk");
  const [sortOrder, setSortOrder] = useState("desc");

  // Enhance raw data with additional properties
  const enhancedZones = useMemo(() => {
    if (!rawCrimeData || rawCrimeData.length === 0) return [];
    return enhanceZones(rawCrimeData);
  }, []);

  // Apply filters
  const filteredZones = useMemo(() => {
    return filterZones(enhancedZones, crimeTypeFilter, timePeriodFilter, search);
  }, [enhancedZones, crimeTypeFilter, timePeriodFilter, search]);

  // Calculate statistics
  const statistics = useMemo(() => {
    return getStatistics(filteredZones);
  }, [filteredZones]);

  const timePeriodStatistics = useMemo(() => {
    return getTimePeriodStatistics(filteredZones);
  }, [filteredZones]);

  // Sort zones
  const sortedZones = useMemo(() => {
    if (!filteredZones || filteredZones.length === 0) return [];
    
    return [...filteredZones].sort((a, b) => {
      if (sortBy === "risk") {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1, normal: 0 };
        const riskA = riskOrder[a.riskLevel?.toLowerCase()] || 0;
        const riskB = riskOrder[b.riskLevel?.toLowerCase()] || 0;
        return sortOrder === "desc" ? riskB - riskA : riskA - riskB;
      }
      if (sortBy === "quantity") {
        return sortOrder === "desc" 
          ? (b.quantity || 0) - (a.quantity || 0)
          : (a.quantity || 0) - (b.quantity || 0);
      }
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? (b.date || "").localeCompare(a.date || "")
          : (a.date || "").localeCompare(b.date || "");
      }
      return 0;
    });
  }, [filteredZones, sortBy, sortOrder]);

  const areaName = useMemo(() => {
    return "Bangladesh Crime Map";
  }, []);

  const setActiveZone = (index) => {
    setActiveZoneIndex(index);
  };

  const clearActiveZone = () => {
    setActiveZoneIndex(null);
  };

  const setHovered = (zone) => {
    setHoveredZone(zone);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return {
    zones: sortedZones,
    filteredZones: sortedZones,
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
  };
};