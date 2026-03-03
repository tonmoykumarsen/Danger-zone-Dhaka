// src/components/Map/MapMarker.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { getTypeConfig, getRiskLevel, calculateMarkerSize } from "../../utils/helpers";

const MapMarker = ({ zone, isActive, isHovered, onClick }) => {
  const { colors } = useTheme();
  const config = getTypeConfig(zone.type);
  const risk = getRiskLevel(zone.quantity);
  const size = calculateMarkerSize(zone.quantity);

  return (
    <div
      onClick={onClick}
      className={`map-marker ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        position: 'relative',
        cursor: 'pointer',
        transform: 'translate(-50%, -100%)',
        zIndex: isActive ? 1000 : (isHovered ? 900 : 1),
      }}
    >
      {/* Pulse effect for active/hovered */}
      {(isActive || isHovered) && (
        <div className="marker-pulse-ring" style={{ backgroundColor: config.color }} />
      )}

      {/* Main marker */}
      <div
        className="marker-body"
        style={{
          width: size,
          height: size,
          backgroundColor: config.color,
          boxShadow: `0 0 ${zone.quantity * 3}px ${config.color}, 0 2px 8px rgba(0,0,0,0.8)`,
        }}
      >
        <span className="marker-icon">{config.icon}</span>
      </div>

      {/* Quantity badge */}
      <div className="marker-badge" style={{ backgroundColor: risk.color }}>
        {zone.quantity}
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="marker-tooltip" style={{
          background: colors.surface2,
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
        }}>
          <div className="tooltip-header" style={{ color: colors.text.primary }}>
            <strong>{zone.main_area}</strong> - {zone.sub_area}
          </div>
          <div className="tooltip-body" style={{ color: colors.text.secondary }}>
            <span style={{ color: config.color }}>{config.badge}</span>
            <span> | Risk: {risk.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapMarker;