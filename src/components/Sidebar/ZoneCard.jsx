// src/components/Sidebar/ZoneCard.jsx
import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { formatBengaliDate } from "../../utils/helpers";
import "./ZoneCard.css";

const ZoneCard = ({ zone, index, active, onClick, onHover }) => {
  const { language } = useLanguage();
  const { colors } = useTheme();
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
        background: `${colors.risk.critical}22`,
        color: colors.risk.critical,
        borderColor: `${colors.risk.critical}44`
      };
    } else if (risk.label === "উচ্চ ঝুঁকি" || risk.label === "High Risk") {
      return {
        ...baseStyle,
        background: `${colors.risk.high}22`,
        color: colors.risk.high,
        borderColor: `${colors.risk.high}44`
      };
    } else if (risk.label === "মাঝারি ঝুঁকি" || risk.label === "Medium Risk") {
      return {
        ...baseStyle,
        background: `${colors.risk.medium}22`,
        color: colors.risk.medium,
        borderColor: `${colors.risk.medium}44`
      };
    } else if (risk.label === "নিম্ন ঝুঁকি" || risk.label === "Low Risk") {
      return {
        ...baseStyle,
        background: `${colors.risk.low}22`,
        color: colors.risk.low,
        borderColor: `${colors.risk.low}44`
      };
    } else {
      return {
        ...baseStyle,
        background: `${colors.risk.normal}22`,
        color: colors.risk.normal,
        borderColor: `${colors.risk.normal}44`
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
        boxShadow: active ? `0 0 14px ${typeConfig.color}44` : 'none',
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: typeConfig.color,
      }}
    >
      <div className="zone-card-header">
        <div className="zone-title">
          <h4 style={{ color: colors.text.primary }}>{zone.main_area}</h4>
          <span className="sub-area" style={{ color: colors.text.muted }}>{zone.main_area}</span>
        </div>
        
        <div className="zone-quantity" style={{ color: typeConfig.color }}>
          <span className="quantity-number">{zone.quantity}</span>
          <span className="quantity-label" style={{ color: colors.text.muted }}>
            {language === 'bn' ? 'টি মামলা' : 'cases'}
          </span>
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

      <div className="zone-meta" style={{ color: colors.text.muted }}>
        <span>{zone.period}</span>
        <span>•</span>
        <span>{(zone.confidence * 100).toFixed(1)}%</span>
        <span>•</span>
        <span>{zone.date}</span>
      </div>

      {isHighlighted && (
        <div className="zone-details" style={{ borderTopColor: colors.border }}>
          <div className="detail-row" style={{ color: colors.text.secondary }}>
            <span>📅 {formatBengaliDate(zone.date)}</span>
            <span>⏰ {zone.period}</span>
          </div>
          <div className="detail-row" style={{ color: colors.text.secondary }}>
            <span>📍 {language === 'bn' ? 'অক্ষাংশ' : 'Lat'}: {zone.location[0].toFixed(4)}</span>
            <span>📌 {language === 'bn' ? 'দ্রাঘিমা' : 'Lng'}: {zone.location[1].toFixed(4)}</span>
          </div>
          <div className="detail-hint" style={{ color: colors.text.muted, background: colors.surface2 }}>
            {language === 'bn' ? '👆 মানচিত্রে দেখতে ক্লিক করুন' : '👆 Click to view on map'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;