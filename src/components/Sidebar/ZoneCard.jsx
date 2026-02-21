import React, { useState } from "react";
import { formatBengaliDate } from "../../utils/helpers";
import "./ZoneCard.css";

const ZoneCard = ({ zone, index, active, onClick, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const typeConfig = zone.typeConfig;
  const risk = zone.risk;
  const isHighlighted = hovered || active;

  const handleMouseEnter = () => {
    setHovered(true);
    onHover?.(zone);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onHover?.(null);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`zone-card ${isHighlighted ? 'highlighted' : ''} ${active ? 'active' : ''}`}
      style={{
        borderLeftColor: typeConfig.color,
        boxShadow: active ? `0 0 14px ${typeConfig.color}44` : 'none',
      }}
    >
      <div className="zone-card-header">
        <div className="zone-title">
          <h4>{zone.main_area}</h4>
          <span className="sub-area">{zone.main_area}</span>
        </div>
        
        <div className="zone-quantity" style={{ color: typeConfig.color }}>
          <span className="quantity-number">{zone.quantity}</span>
          <span className="quantity-label">টি মামলা</span>
        </div>
      </div>

      <div className="zone-badges">
        <span className="type-badge" style={{ 
          backgroundColor: `${typeConfig.color}22`,
          color: typeConfig.color,
          borderColor: `${typeConfig.color}44`
        }}>
          {typeConfig.icon} {typeConfig.badge}
        </span>
        
        <span className="risk-badge" style={{ 
          backgroundColor: `${risk.color}18`,
          color: risk.color,
          borderColor: `${risk.color}33`
        }}>
          {risk.emoji} {risk.label}
        </span>
      </div>

      {isHighlighted && (
        <div className="zone-details">
          <div className="detail-row">
            <span>📅 {formatBengaliDate(zone.date)}</span>
            <span>🎯 {(zone.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="detail-row">
            <span>📍 অক্ষাংশ: {zone.location[0].toFixed(4)}</span>
            <span>📌 দ্রাঘিমা: {zone.location[1].toFixed(4)}</span>
          </div>
          <div className="detail-hint">👆 মানচিত্রে দেখতে ক্লিক করুন</div>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;