// src/components/Map/CrimeMap.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BANGLADESH_CENTER, DEFAULT_ZOOM, TYPE_CONFIG } from "../../constants/config";
import "../../styles/map.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Light map tile layers
const LIGHT_TILE_LAYERS = {
  cartoLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
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

  return (
    <div 
      className="hover-modal"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 2000,
        minWidth: '250px',
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      <div style={{ borderLeft: `4px solid ${typeConfig.color}`, paddingLeft: '8px', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{zone.main_area}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>{zone.main_area}</div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
        <div>
          <div style={{ color: '#64748b' }}>Type</div>
          <div style={{ color: typeConfig.color, fontWeight: 600 }}>{typeConfig.icon} {typeConfig.badge}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Cases</div>
          <div style={{ color: typeConfig.color, fontWeight: 'bold' }}>{zone.quantity}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Risk</div>
          <div style={{ color: risk.color }}>{risk.emoji} {risk.label}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Time</div>
          <div style={{ color: '#0f172a' }}>{zone.period}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
        Click for details →
      </div>
    </div>
  );
};

const CrimeMap = ({ zones, activeZone, hoveredZone, onZoneHover, onZoneClick, isModalOpen = false }) => {
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

    // Add light map tiles
    L.tileLayer(LIGHT_TILE_LAYERS.cartoLight, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
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

  // Update map interactions when modal state changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (isModalOpen) {
        mapInstanceRef.current.dragging.disable();
        mapInstanceRef.current.scrollWheelZoom.disable();
        mapInstanceRef.current.doubleClickZoom.disable();
        mapInstanceRef.current.boxZoom.disable();
        mapInstanceRef.current.keyboard.disable();
      } else {
        mapInstanceRef.current.dragging.enable();
        mapInstanceRef.current.scrollWheelZoom.enable();
        mapInstanceRef.current.doubleClickZoom.enable();
        mapInstanceRef.current.boxZoom.enable();
        mapInstanceRef.current.keyboard.enable();
      }
    }
  }, [isModalOpen]);

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
        if (!isModalOpen) {
          onZoneHover(zone);
          marker.setZIndexOffset(2000);
          
          // Calculate position for hover modal
          const point = mapInstanceRef.current.latLngToContainerPoint(zone.location);
          setHoverModal({
            visible: true,
            zone: zone,
            position: { x: point.x, y: point.y }
          });
        }
      });
      
      marker.on('mouseout', () => {
        onZoneHover(null);
        marker.setZIndexOffset(1000);
        setHoverModal({ visible: false, zone: null, position: null });
      });
      
      marker.on('click', () => {
        if (!isModalOpen) {
          onZoneClick(index);
        }
      });

      // Create popup
      const popupContent = `
        <div style="font-family: 'DM Sans', sans-serif; min-width: 250px; background: white; border-radius: 8px; overflow: hidden;">
          <div style="border-left: 4px solid ${typeConfig.color}; padding: 12px; background: #f8fafc;">
            <div style="font-weight: bold; font-size: 16px; color: #0f172a;">${zone.main_area}</div>
            <div style="font-size: 12px; color: #475569;">${zone.main_area}</div>
          </div>
          <div style="padding: 12px; background: white;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Crime Type</div>
                <div style="color: ${typeConfig.color}; font-weight: 600; font-size: 13px;">${typeConfig.icon} ${typeConfig.badge}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Cases</div>
                <div style="color: ${typeConfig.color}; font-weight: bold; font-size: 16px;">${zone.quantity}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Risk Level</div>
                <div style="color: ${zone.risk.color}; font-weight: 600; font-size: 13px;">${zone.risk.emoji} ${zone.risk.label}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Time</div>
                <div style="color: #334155; font-size: 13px;">${zone.period}</div>
              </div>
            </div>
          </div>
          <div style="padding: 8px 12px; background: #f1f5f9; border-top: 1px solid #e2e8f0; font-size: 11px; color: #475569;">
            📍 ${zone.location[0].toFixed(4)}, ${zone.location[1].toFixed(4)} • ${zone.date}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 300,
      });
    });

    // Fit bounds to show all markers
    if (zones.length > 0) {
      const validZones = zones.filter(z => z && z.location);
      if (validZones.length > 0) {
        const bounds = L.latLngBounds(validZones.map(z => z.location));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    }
  }, [zones, onZoneHover, onZoneClick, isModalOpen]);

  // Handle active zone
  useEffect(() => {
    if (activeZone !== null && markersRef.current[activeZone] && zones && zones[activeZone] && !isModalOpen) {
      markersRef.current[activeZone].openPopup();
      mapInstanceRef.current.panTo(zones[activeZone].location, { animate: true, duration: 0.5 });
    }
  }, [activeZone, zones, isModalOpen]);

  // Handle hovered zone
  useEffect(() => {
    if (hoveredZone !== null && markersRef.current[hoveredZone] && !isModalOpen) {
      markersRef.current[hoveredZone].setZIndexOffset(2000);
    }
  }, [hoveredZone, isModalOpen]);

  // Calculate stats
  const calculateLocationStats = () => {
    if (!zones || zones.length === 0) {
      return { totalLocations: 0, totalCases: 0, highRiskCount: 0 };
    }

    const locationMap = new Map();
    let totalCases = 0;
    let highRiskCount = 0;
    
    zones.forEach(zone => {
      const location = zone.main_area;
      const quantity = zone.quantity || 0;
      totalCases += quantity;
      
      if (!locationMap.has(location)) {
        locationMap.set(location, { totalQuantity: 0 });
      }
      locationMap.get(location).totalQuantity += quantity;
    });

    locationMap.forEach(data => {
      if (data.totalQuantity >= 20) highRiskCount++;
    });

    return {
      totalLocations: locationMap.size,
      totalCases,
      highRiskCount
    };
  };

  const stats = calculateLocationStats();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      
      {/* Hover Modal */}
      {!isModalOpen && hoverModal.visible && <HoverModal zone={hoverModal.zone} position={hoverModal.position} />}
      
      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 1000,
        background: 'white',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
        maxWidth: '220px',
      }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#1e293b' }}>Crime Types</h4>
        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>
              {config.icon}
            </div>
            <div style={{ fontSize: '11px', color: '#334155' }}>{config.badge}</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginLeft: 'auto' }}>
              {zones?.filter(z => z?.type === key).length || 0}
            </div>
          </div>
        ))}
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', fontSize: '10px', color: '#64748b' }}>
          <div>🔵 Marker size = case count</div>
          <div>🖱️ Hover for details</div>
        </div>
      </div>

      {/* Map Controls */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {[
          { icon: '🏠', action: () => mapInstanceRef.current?.setView(BANGLADESH_CENTER, DEFAULT_ZOOM), title: 'Reset view' },
          { icon: '+', action: () => mapInstanceRef.current?.zoomIn(), title: 'Zoom in' },
          { icon: '−', action: () => mapInstanceRef.current?.zoomOut(), title: 'Zoom out' },
          { icon: '⌂', action: () => {
            if (zones?.length > 0) {
              const validZones = zones.filter(z => z && z.location);
              if (validZones.length > 0) {
                const bounds = L.latLngBounds(validZones.map(z => z.location));
                mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50] });
              }
            }
          }, title: 'Show all' }
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            title={btn.title}
            disabled={isModalOpen}
            style={{
              width: '40px',
              height: '40px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#1e293b',
              fontSize: '18px',
              cursor: isModalOpen ? 'not-allowed' : 'pointer',
              opacity: isModalOpen ? 0.5 : 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isModalOpen) e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              if (!isModalOpen) e.currentTarget.style.background = 'white';
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Stats Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        background: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Locations</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalLocations}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Total Cases</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalCases}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#64748b' }}>High Risk</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>{stats.highRiskCount}</div>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;