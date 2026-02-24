import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { getStatistics } from "../../utils/helpers";

const StatItem = ({ label, value, color }) => (
  <div style={{
    background: "#0f0f1a",
    border: `1px solid ${color}33`,
    borderRadius: 7,
    padding: "7px 4px",
    textAlign: "center"
  }}>
    <div style={{
      fontFamily: "'Bebas Neue',cursive",
      fontSize: 20,
      lineHeight: 1,
      color: color,
      textShadow: `0 0 10px ${color}88`
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 8.5,
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginTop: 3
    }}>
      {label}
    </div>
  </div>
);

const RiskLevelIndicator = ({ riskCounts }) => {
  const { t } = useLanguage();
  
  const counts = riskCounts || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    normal: 0
  };
  
  const riskItems = [
    { label: t('critical'), value: counts.critical, color: "#ff2d2d", emoji: "🔥" },
    { label: t('high'), value: counts.high, color: "#ff6b1a", emoji: "⚠️" },
    { label: t('medium'), value: counts.medium, color: "#f0a500", emoji: "⚡" },
    { label: t('low'), value: counts.low, color: "#22c55e", emoji: "✅" },
    { label: t('normal'), value: counts.normal, color: "#3b82f6", emoji: "ℹ️" }
  ];

  return (
    <div style={{
      background: "#0f0f1a",
      borderRadius: 7,
      padding: "10px",
      marginTop: "10px"
    }}>
      <div style={{
        fontSize: 9,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "4px"
      }}>
        <span>⚠️</span>
        <span>{t('byRiskLevel')}</span>
      </div>
      {riskItems.map(item => (
        <div key={item.label} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          fontSize: "10px"
        }}>
          <span style={{ color: item.color, display: "flex", alignItems: "center", gap: "4px" }}>
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </span>
          <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const HotspotIndicator = ({ hotspot }) => {
  const { t } = useLanguage();
  
  if (!hotspot) return null;

  return (
    <div style={{
      background: "#1a000a",
      border: "1px solid #ff2d2d2a",
      borderRadius: 7,
      padding: "10px",
      marginTop: "10px"
    }}>
      <div style={{
        fontSize: 9,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "4px"
      }}>
        <span>🔥</span>
        <span>{t('hotspot')}</span>
      </div>
      
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9" }}>
            {hotspot.main_area}
          </div>
          <div style={{ fontSize: "10px", color: "#64748b" }}>
            {hotspot.sub_area}
          </div>
          <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
            {hotspot.period} • {hotspot.date}
          </div>
          <div style={{ fontSize: "9px", color: hotspot.risk.color, marginTop: "2px" }}>
            {hotspot.risk.emoji} {hotspot.risk.label} (Total: {hotspot.totalLocationQuantity || hotspot.quantity})
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            background: "#ff2d2d22",
            color: "#ff2d2d",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 700
          }}>
            {hotspot.quantity}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsBar = ({ zones }) => {
  const { t } = useLanguage();
  const stats = getStatistics(zones);

  const safeStats = {
    total: stats?.total || 0,
    murders: stats?.murders || 0,
    rape: stats?.rape || 0,
    robbery: stats?.robbery || 0,
    kidnapping: stats?.kidnapping || 0,
    drugs: stats?.drugs || 0,
    others: stats?.others || 0,
    riskCounts: stats?.riskCounts || {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      normal: 0
    }
  };

  const statItems = [
    { label: t('totalLocations'), value: safeStats.total, color: "#60a5fa" },
    { label: t('murder'), value: safeStats.murders, color: "#ff2d2d" },
    { label: t('rape'), value: safeStats.rape, color: "#ff6b1a" },
    { label: t('robbery'), value: safeStats.robbery, color: "#ff4500" },
    { label: t('kidnapping'), value: safeStats.kidnapping, color: "#f0a500" },
    { label: t('drugs'), value: safeStats.drugs, color: "#22c55e" },
    { label: t('others'), value: safeStats.others, color: "#6b7280" },
  ];

  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 5,
        marginBottom: 8
      }}>
        {statItems.slice(0, 4).map(item => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 5,
        marginBottom: 8
      }}>
        {statItems.slice(4).map(item => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>

      <RiskLevelIndicator riskCounts={safeStats.riskCounts} />
      
      <HotspotIndicator hotspot={stats?.hotspot} />
    </div>
  );
};

export default StatsBar;