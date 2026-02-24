import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BANGLADESH_CENTER, DEFAULT_ZOOM, MAP_TILES, TYPE_CONFIG } from "../../constants/config";
import { formatBengaliDate } from "../../utils/helpers";
import "../../styles/map.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

const HoverModal = ({ zone, position }) => {
  if (!zone || !position) return null;

  const typeConfig = zone.typeConfig;
  const risk = zone.risk;

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
          <span className="modal-label">📍 অবস্থান</span>
          <span className="modal-value">{zone.main_area}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">🔫 অপরাধের ধরন</span>
          <span className="modal-value" style={{ color: typeConfig.color }}>
            {typeConfig.icon} {typeConfig.badge}
          </span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">📊 মামলার সংখ্যা</span>
          <span className="modal-value cases">{zone.quantity} টি</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">⚠️ ঝুঁকির মাত্রা</span>
          <span className="modal-value" style={{ color: risk.color }}>
            {risk.emoji} {risk.label}
          </span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">📅 তারিখ</span>
          <span className="modal-value">{formatBengaliDate(zone.date)}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">⏰ সময়</span>
          <span className="modal-value">{zone.period || "অজানা"}</span>
        </div>
        
        <div className="modal-row">
          <span className="modal-label">🎯 আত্মবিশ্বাস</span>
          <span className="modal-value">{(zone.confidence * 100).toFixed(1)}%</span>
        </div>
        
        <div className="modal-coordinates">
          <span>অক্ষাংশ: {zone.location[0].toFixed(4)}</span>
          <span>দ্রাঘিমা: {zone.location[1].toFixed(4)}</span>
        </div>
      </div>
      
      <div className="modal-footer">
        <span className="modal-action">বিস্তারিত জানতে ক্লিক করুন →</span>
      </div>
    </div>
  );
};

const CrimeMap = ({ zones, activeZone, hoveredZone, onZoneHover, onZoneClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [hoverModal, setHoverModal] = useState({ visible: false, zone: null, position: null });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: BANGLADESH_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
    });

    L.tileLayer(MAP_TILES.dark, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    L.control.scale({ imperial: false, metric: true }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    zones.forEach((zone, index) => {
      const typeConfig = zone.typeConfig;
      const risk = zone.risk;

      const icon = createCustomIcon(typeConfig, zone.quantity);

      const marker = L.marker(zone.location, { 
        icon,
        riseOnHover: true,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);

      markersRef.current[index] = marker;

      marker.on('mouseover', () => {
        onZoneHover(zone);
        marker.setZIndexOffset(2000);
        
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

      const popupContent = `
        <div class="crime-popup">
          <div class="popup-header" style="border-left-color: ${typeConfig.color}">
            <h3>${zone.main_area}</h3>
            <span class="sub-area">${zone.main_area}</span>
          </div>
          <div class="popup-stats">
            <div class="stat-item">
              <span class="stat-label">অপরাধের ধরন</span>
              <span class="stat-value" style="color: ${typeConfig.color}">
                ${typeConfig.icon} ${typeConfig.badge}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">মোট মামলা</span>
              <span class="stat-value cases">${zone.quantity}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">ঝুঁকি মূল্যায়ন</span>
              <span class="stat-value" style="color: ${risk.color}">
                ${risk.emoji} ${risk.label}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">সময়</span>
              <span class="stat-value">${zone.period || "অজানা"}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">আত্মবিশ্বাস</span>
              <span class="stat-value">${(zone.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div class="popup-details">
            <div class="detail-section">
              <div class="detail-title">📍 অবস্থানের বিবরণ</div>
              <div class="detail-grid">
                <div>অক্ষাংশ: ${zone.location[0].toFixed(4)}</div>
                <div>দ্রাঘিমা: ${zone.location[1].toFixed(4)}</div>
                <div>জেলা: ${zone.main_area}</div>
                <div>তারিখ: ${formatBengaliDate(zone.date)}</div>
                <div>সময়: ${zone.period || "অজানা"}</div>
              </div>
            </div>
            <div class="detail-section">
              <div class="detail-title">📊 পরিসংখ্যান</div>
              <div class="detail-grid">
                <div>মাসিক গড়: ${(zone.quantity / 12).toFixed(1)}</div>
                <div>প্রবণতা: ${zone.quantity > 20 ? '↑ বৃদ্ধি' : '→ স্থিতিশীল'}</div>
                <div>ট্রেন্ড: ${zone.quantity > 50 ? 'অতি উদ্বেগজনক' : zone.quantity > 20 ? 'উদ্বেগজনক' : 'স্বাভাবিক'}</div>
                <div>প্যাট্রোল অগ্রাধিকার: ${zone.quantity > 50 ? 'সর্বোচ্চ' : zone.quantity > 20 ? 'উচ্চ' : zone.quantity > 10 ? 'মাঝারি' : 'নিম্ন'}</div>
              </div>
            </div>
          </div>
          <div class="popup-footer">
            <span class="timestamp">সর্বশেষ আপডেট: ${formatBengaliDate(zone.date)}</span>
            <span class="badge-critical" style="background-color: ${typeConfig.color}22; color: ${typeConfig.color}">
              ${typeConfig.badge} এলার্ট
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

    if (zones.length > 0) {
      const bounds = L.latLngBounds(zones.map(z => z.location));
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], animate: true });
    }
  }, [zones, onZoneHover, onZoneClick]);

  useEffect(() => {
    if (activeZone !== null && markersRef.current[activeZone]) {
      markersRef.current[activeZone].openPopup();
      if (zones[activeZone]) {
        mapInstanceRef.current.panTo(zones[activeZone].location, { animate: true, duration: 0.5 });
      }
    }
  }, [activeZone, zones]);

  useEffect(() => {
    if (hoveredZone !== null && markersRef.current[hoveredZone]) {
      markersRef.current[hoveredZone].setZIndexOffset(2000);
    }
  }, [hoveredZone]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      
      {hoverModal.visible && <HoverModal zone={hoverModal.zone} position={hoverModal.position} />}
      
      <div className="map-legend">
        <h4>অপরাধের ধরন</h4>
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
                  {zones.filter(z => z.type === key).length}টি স্থান
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="legend-note">
          <span>🔵 মার্কারের আকার = মামলার সংখ্যা</span>
          <span>🖱️ কার্সর রাখলে দ্রুত তথ্য দেখুন</span>
        </div>
      </div>

      <div className="map-controls">
        <button className="map-control-btn" onClick={() => mapInstanceRef.current?.setView(BANGLADESH_CENTER, DEFAULT_ZOOM)} title="পুনরায় সেট করুন">
          <span className="btn-icon">🏠</span>
        </button>
        <button className="map-control-btn" onClick={() => mapInstanceRef.current?.zoomIn()} title="জুম ইন">
          <span className="btn-icon">+</span>
        </button>
        <button className="map-control-btn" onClick={() => mapInstanceRef.current?.zoomOut()} title="জুম আউট">
          <span className="btn-icon">−</span>
        </button>
        <button className="map-control-btn" onClick={() => {
          if (zones.length > 0) {
            const bounds = L.latLngBounds(zones.map(z => z.location));
            mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50] });
          }
        }} title="সব মার্কার দেখান">
          <span className="btn-icon">⌂</span>
        </button>
      </div>

      <div className="stats-overlay">
        <div className="stats-item">
          <span className="stats-label">মোট অবস্থান</span>
          <span className="stats-value">{zones.length}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">মোট মামলা</span>
          <span className="stats-value">{zones.reduce((sum, z) => sum + z.quantity, 0)}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">উচ্চ ঝুঁকিপূর্ণ</span>
          <span className="stats-value" style={{ color: '#ff2d2d' }}>
            {zones.filter(z => z.quantity >= 20).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;