import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { formatBengaliDate } from "../../utils/helpers";
import "./ZoneCard.css";

const ZoneCard = ({ zone, index, active, onClick, onHover }) => {
  const { t, language } = useLanguage();
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

  const getRiskBadgeStyle = () => {
    const baseStyle = {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      border: "1px solid transparent"
    };

    if (risk.label === "সবচেয়ে ঝুঁকিপূর্ণ" || risk.label === "Critical") {
      return {
        ...baseStyle,
        background: "#ff2d2d22",
        color: "#ff2d2d",
        borderColor: "#ff2d2d44"
      };
    } else if (risk.label === "উচ্চ ঝুঁকি" || risk.label === "High Risk") {
      return {
        ...baseStyle,
        background: "#ff6b1a22",
        color: "#ff6b1a",
        borderColor: "#ff6b1a44"
      };
    } else if (risk.label === "মাঝারি ঝুঁকি" || risk.label === "Medium Risk") {
      return {
        ...baseStyle,
        background: "#f0a50022",
        color: "#f0a500",
        borderColor: "#f0a50044"
      };
    } else if (risk.label === "নিম্ন ঝুঁকি" || risk.label === "Low Risk") {
      return {
        ...baseStyle,
        background: "#22c55e22",
        color: "#22c55e",
        borderColor: "#22c55e44"
      };
    } else {
      return {
        ...baseStyle,
        background: "#3b82f622",
        color: "#3b82f6",
        borderColor: "#3b82f644"
      };
    }
  };

  // Get translated risk label
  const getRiskLabel = () => {
    if (language === 'bn') {
      return risk.label;
    } else {
      const translationMap = {
        "সবচেয়ে ঝুঁকিপূর্ণ": "Critical",
        "উচ্চ ঝুঁকি": "High Risk",
        "মাঝারি ঝুঁকি": "Medium Risk",
        "নিম্ন ঝুঁকি": "Low Risk",
        "স্বাভাবিক": "Normal"
      };
      return translationMap[risk.label] || risk.label;
    }
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
          <span className="quantity-label">{language === 'bn' ? 'টি মামলা' : 'cases'}</span>
        </div>
      </div>

      <div className="zone-badges">
        <span className="type-badge" style={{ 
          backgroundColor: `${typeConfig.color}22`,
          color: typeConfig.color,
          borderColor: `${typeConfig.color}44`
        }}>
          {typeConfig.icon} {language === 'bn' ? typeConfig.badge : typeConfig.description.split('/')[0].trim()}
        </span>
        
        <span className="risk-badge" style={getRiskBadgeStyle()}>
          {risk.emoji} {getRiskLabel()}
        </span>
      </div>

      <div className="zone-meta">
        <span>{zone.period}</span>
        <span>•</span>
        <span>{(zone.confidence * 100).toFixed(1)}%</span>
        <span>•</span>
        <span>{zone.date}</span>
      </div>

      {isHighlighted && (
        <div className="zone-details">
          <div className="detail-row">
            <span>📅 {formatBengaliDate(zone.date)}</span>
            <span>⏰ {zone.period}</span>
          </div>
          <div className="detail-row">
            <span>📍 {language === 'bn' ? 'অক্ষাংশ' : 'Lat'}: {zone.location[0].toFixed(4)}</span>
            <span>📌 {language === 'bn' ? 'দ্রাঘিমা' : 'Lng'}: {zone.location[1].toFixed(4)}</span>
          </div>
          <div className="detail-hint">
            {language === 'bn' ? '👆 মানচিত্রে দেখতে ক্লিক করুন' : '👆 Click to view on map'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;