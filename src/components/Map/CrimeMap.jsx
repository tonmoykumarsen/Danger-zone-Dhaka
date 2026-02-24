import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BANGLADESH_CENTER, DEFAULT_ZOOM, TYPE_CONFIG } from "../../constants/config";
import { formatBengaliDate, getRiskLevel } from "../../utils/helpers";
import "../../styles/map.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Free tile layers that don't require authentication
const TILE_LAYERS = {
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  cartoDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  cartoLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  stamen: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
};

// Custom marker icons for different crime types
const createCustomIcon = (typeConfig, quantity, isHovered = false) => {
  const size = Math.max(24, 18 + Math.sqrt(quantity) * 4);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container ${isHovered ? 'hovered' : ''}" style="width: ${size}px; height: ${size}px;">
        <div class="marker-pulse" style="background-color: ${typeConfig.color}; box-shadow: 0 0 20px ${typeConfig.color};"></div>
        <div class="marker-icon" style="color: white; font-size: ${size * 0.4}px;">${typeConfig.icon}</div>
        <div class="marker-badge" style="background-color: ${typeConfig.color};">${quantity}</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
  });
};

// Hover Modal Component
const HoverModal = ({ zone, position }) => {
  if (!zone || !position) return null;

  const typeConfig = zone.typeConfig;
  const risk = zone.risk;

  // Get risk label based on language
  const getRiskLabel = () => {
    return risk.label;
  };

  return (
    <div 
      className="hover-modal"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="modal-header" style={{ borderLeftColor: typeConfig.color }}>
        <h3>{zone.main_area}</h3>
        <span className="sub-area">{zone.main_area}</span>
      </div>
      
      <div className="modal-content">
        <div className="modal-row">
          <span className="modal-label">📍 Location</span>
          <span className="modal-value">{zone.main_area}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">🔫 Crime Type</span>
          <span className="modal-value" style={{ color: typeConfig.color }}>
            {typeConfig.icon} {typeConfig.badge}
          </span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">📊 Cases</span>
          <span className="modal-value cases">{zone.quantity}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">⚠️ Risk Level</span>
          <span className="modal-value" style={{ color: risk.color }}>
            {risk.emoji} {getRiskLabel()}
          </span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">📅 Date</span>
          <span className="modal-value">{formatBengaliDate(zone.date)}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">⏰ Time</span>
          <span className="modal-value">{zone.period || "Unknown"}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">🎯 Confidence</span>
          <span className="modal-value">{(zone.confidence * 100).toFixed(1)}%</span>
        </div>
        
        <div className="modal-coordinates">
          <span>Lat: {zone.location[0].toFixed(4)}</span>
          <span>Lng: {zone.location[1].toFixed(4)}</span>
        </div>
      </div>
      
      <div className="modal-footer">
        <span className="modal-action">Click for details →</span>
      </div>
    </div>
  );
};

const CrimeMap = ({ zones, activeZone, hoveredZone, onZoneHover, onZoneClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [hoverModal, setHoverModal] = useState({ visible: false, zone: null, position: null });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: BANGLADESH_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
    });

    // Use CartoDB dark theme (free, no authentication required)
    L.tileLayer(TILE_LAYERS.cartoDark, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
      noWrap: true
    }).addTo(mapInstanceRef.current);

    // Add scale control
    L.control.scale({ imperial: false, metric: true }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when zones change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!zones || zones.length === 0) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    zones.forEach((zone, index) => {
      if (!zone || !zone.location) return;
      
      const typeConfig = zone.typeConfig;
      const risk = zone.risk;

      // Create custom icon
      const icon = createCustomIcon(typeConfig, zone.quantity);

      const marker = L.marker(zone.location, { 
        icon,
        riseOnHover: true,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);

      // Store marker reference
      markersRef.current[index] = marker;

      // Add hover events
      marker.on('mouseover', () => {
        onZoneHover(zone);
        marker.setZIndexOffset(2000);
        
        // Calculate position for hover modal
        const point = mapInstanceRef.current.latLngToContainerPoint(zone.location);
        setHoverModal({
          visible: true,
          zone: zone,
          position: { x: point.x, y: point.y - 50 }
        });
      });
      
      marker.on('mouseout', () => {
        onZoneHover(null);
        marker.setZIndexOffset(1000);
        setHoverModal({ visible: false, zone: null, position: null });
      });
      
      marker.on('click', () => {
        onZoneClick(index);
        marker.openPopup();
      });

      // Create detailed popup content
      const popupContent = `
        <div class="crime-popup">
          <div class="popup-header" style="border-left-color: ${typeConfig.color}">
            <h3>${zone.main_area}</h3>
            <span class="sub-area">${zone.main_area}</span>
          </div>
          <div class="popup-stats">
            <div class="stat-item">
              <span class="stat-label">Crime Type</span>
              <span class="stat-value" style="color: ${typeConfig.color}">
                ${typeConfig.icon} ${typeConfig.badge}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Cases</span>
              <span class="stat-value cases">${zone.quantity}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Risk Level</span>
              <span class="stat-value" style="color: ${risk.color}">
                ${risk.emoji} ${risk.label}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Time</span>
              <span class="stat-value">${zone.period || "Unknown"}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Confidence</span>
              <span class="stat-value">${(zone.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div class="popup-details">
            <div class="detail-section">
              <div class="detail-title">📍 Location Details</div>
              <div class="detail-grid">
                <div>Latitude: ${zone.location[0].toFixed(4)}</div>
                <div>Longitude: ${zone.location[1].toFixed(4)}</div>
                <div>District: ${zone.main_area}</div>
                <div>Date: ${formatBengaliDate(zone.date)}</div>
                <div>Time: ${zone.period || "Unknown"}</div>
              </div>
            </div>
            <div class="detail-section">
              <div class="detail-title">📊 Statistics</div>
              <div class="detail-grid">
                <div>Monthly Avg: ${(zone.quantity / 12).toFixed(1)}</div>
                <div>Trend: ${zone.quantity > 20 ? '↑ Rising' : '→ Stable'}</div>
                <div>Severity: ${zone.quantity > 50 ? 'Critical' : zone.quantity > 20 ? 'High' : zone.quantity > 10 ? 'Medium' : 'Low'}</div>
                <div>Patrol Priority: ${zone.quantity > 50 ? 'Highest' : zone.quantity > 20 ? 'High' : zone.quantity > 10 ? 'Medium' : 'Low'}</div>
              </div>
            </div>
          </div>
          <div class="popup-footer">
            <span class="timestamp">Last Updated: ${formatBengaliDate(zone.date)}</span>
            <span class="badge-critical" style="background-color: ${typeConfig.color}22; color: ${typeConfig.color}">
              ${typeConfig.badge} ALERT
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup enhanced-popup',
        maxWidth: 380,
        minWidth: 320,
      });
    });

    // Fit bounds to show all markers
    if (zones.length > 0) {
      const validZones = zones.filter(z => z && z.location);
      if (validZones.length > 0) {
        const bounds = L.latLngBounds(validZones.map(z => z.location));
        mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], animate: true });
      }
    }
  }, [zones, onZoneHover, onZoneClick]);

  // Handle active zone
  useEffect(() => {
    if (activeZone !== null && markersRef.current[activeZone] && zones && zones[activeZone]) {
      markersRef.current[activeZone].openPopup();
      mapInstanceRef.current.panTo(zones[activeZone].location, { animate: true, duration: 0.5 });
    }
  }, [activeZone, zones]);

  // Handle hovered zone
  useEffect(() => {
    if (hoveredZone !== null && markersRef.current[hoveredZone]) {
      markersRef.current[hoveredZone].setZIndexOffset(2000);
    }
  }, [hoveredZone]);

  // Calculate total quantity per location for accurate risk assessment
  const calculateLocationStats = () => {
    if (!zones || zones.length === 0) {
      return {
        totalLocations: 0,
        totalCases: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        normalCount: 0,
        highRiskCount: 0
      };
    }

    // Group by location and sum quantities
    const locationMap = new Map();
    
    zones.forEach(zone => {
      const location = zone.main_area;
      const quantity = zone.quantity || 0;
      
      if (!locationMap.has(location)) {
        locationMap.set(location, {
          totalQuantity: 0,
          crimes: []
        });
      }
      
      const locationData = locationMap.get(location);
      locationData.totalQuantity += quantity;
      locationData.crimes.push(zone);
    });

    // Calculate stats
    let totalCases = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let normalCount = 0;

    locationMap.forEach((data, location) => {
      totalCases += data.totalQuantity;
      
      // Determine risk level based on TOTAL quantity
      if (data.totalQuantity >= 50) {
        criticalCount++;
      } else if (data.totalQuantity >= 20) {
        highCount++;
      } else if (data.totalQuantity >= 10) {
        mediumCount++;
      } else if (data.totalQuantity >= 5) {
        lowCount++;
      } else {
        normalCount++;
      }
    });

    return {
      totalLocations: locationMap.size,
      totalCases: totalCases,
      criticalCount: criticalCount,
      highCount: highCount,
      mediumCount: mediumCount,
      lowCount: lowCount,
      normalCount: normalCount,
      highRiskCount: criticalCount + highCount // Combined high + critical
    };
  };

  const stats = calculateLocationStats();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      
      {/* Hover Modal */}
      {hoverModal.visible && <HoverModal zone={hoverModal.zone} position={hoverModal.position} />}
      
      {/* Map Legend */}
      <div className="map-legend">
        <h4>Crime Types</h4>
        <div className="legend-items">
          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
            <div key={key} className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: config.color }}>
                <span>{config.icon}</span>
              </div>
              <div className="legend-info">
                <span className="legend-type">{config.badge}</span>
                <span className="legend-desc">{config.description}</span>
                <span className="legend-count">
                  {zones?.filter(z => z?.type === key).length || 0} crimes
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Risk Level Legend */}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e1e30' }}>
          <h4 style={{ fontSize: '11px', marginBottom: '8px' }}>Risk Levels (per location)</h4>
          <div className="risk-legend-items">
            <div className="risk-legend-item">
              <span className="risk-dot" style={{ backgroundColor: '#ff2d2d' }}>🔥</span>
              <span>Critical (50+ cases)</span>
              <span style={{ color: '#ff2d2d', fontWeight: 'bold' }}>{stats.criticalCount}</span>
            </div>
            <div className="risk-legend-item">
              <span className="risk-dot" style={{ backgroundColor: '#ff6b1a' }}>⚠️</span>
              <span>High (20-49 cases)</span>
              <span style={{ color: '#ff6b1a', fontWeight: 'bold' }}>{stats.highCount}</span>
            </div>
            <div className="risk-legend-item">
              <span className="risk-dot" style={{ backgroundColor: '#f0a500' }}>⚡</span>
              <span>Medium (10-19 cases)</span>
              <span style={{ color: '#f0a500', fontWeight: 'bold' }}>{stats.mediumCount}</span>
            </div>
            <div className="risk-legend-item">
              <span className="risk-dot" style={{ backgroundColor: '#22c55e' }}>✅</span>
              <span>Low (5-9 cases)</span>
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{stats.lowCount}</span>
            </div>
            <div className="risk-legend-item">
              <span className="risk-dot" style={{ backgroundColor: '#3b82f6' }}>ℹ️</span>
              <span>Normal (0-4 cases)</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{stats.normalCount}</span>
            </div>
          </div>
        </div>
        
        <div className="legend-note" style={{ marginTop: '12px' }}>
          <span>🔵 Marker size = case count</span>
          <span>🖱️ Hover for quick info</span>
        </div>
      </div>

      {/* Map Controls */}
      <div className="map-controls">
        <button className="map-control-btn" onClick={() => mapInstanceRef.current?.setView(BANGLADESH_CENTER, DEFAULT_ZOOM)} title="Reset view">
          <span className="btn-icon">🏠</span>
        </button>
        <button className="map-control-btn" onClick={() => mapInstanceRef.current?.zoomIn()} title="Zoom in">
          <span className="btn-icon">+</span>
        </button>
        <button className="map-control-btn" onClick={() => mapInstanceRef.current?.zoomOut()} title="Zoom out">
          <span className="btn-icon">−</span>
        </button>
        <button className="map-control-btn" onClick={() => {
          if (zones?.length > 0) {
            const validZones = zones.filter(z => z && z.location);
            if (validZones.length > 0) {
              const bounds = L.latLngBounds(validZones.map(z => z.location));
              mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50] });
            }
          }
        }} title="Show all markers">
          <span className="btn-icon">⌂</span>
        </button>
      </div>

      {/* Crime Stats Overlay - UPDATED with correct high risk count */}
      <div className="stats-overlay">
        <div className="stats-item">
          <span className="stats-label">Total Locations</span>
          <span className="stats-value">{stats.totalLocations}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">Total Cases</span>
          <span className="stats-value">{stats.totalCases}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">High Risk</span>
          <span className="stats-value" style={{ color: '#ff2d2d' }}>
            {stats.highRiskCount}
          </span>
        </div>
      </div>

      {/* Add CSS for risk legend */}
      <style>
        {`
          .risk-legend-items {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .risk-legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 10px;
            color: #94a3b8;
            justify-content: space-between;
          }
          .risk-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default CrimeMap;