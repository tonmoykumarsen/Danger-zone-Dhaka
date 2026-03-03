// components/Sidebar/StatsBar.jsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { getStatistics } from "../../utils/helpers";

const StatItem = ({ label, value, color }) => {
  const { colors } = useTheme();
  
  return (
    <div style={{
      background: colors.surface,
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
        color: colors.text.muted,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginTop: 3
      }}>
        {label}
      </div>
    </div>
  );
};

const RiskLevelIndicator = ({ riskCounts }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  
  const counts = riskCounts || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    normal: 0
  };
  
  const riskItems = [
    { label: t('critical'), value: counts.critical, color: colors.risk.critical, emoji: "🔥" },
    { label: t('high'), value: counts.high, color: colors.risk.high, emoji: "⚠️" },
    { label: t('medium'), value: counts.medium, color: colors.risk.medium, emoji: "⚡" },
    { label: t('low'), value: counts.low, color: colors.risk.low, emoji: "✅" },
    { label: t('normal'), value: counts.normal, color: colors.risk.normal, emoji: "ℹ️" }
  ];

  return (
    <div style={{
      background: colors.surface,
      borderRadius: 7,
      padding: "10px",
      marginTop: "10px"
    }}>
      <div style={{
        fontSize: 9,
        color: colors.text.secondary,
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
          <span style={{ color: colors.text.primary, fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const HotspotIndicator = ({ hotspot }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  
  if (!hotspot) return null;

  return (
    <div style={{
      background: colors.accent.red + '11',
      border: `1px solid ${colors.accent.red}2a`,
      borderRadius: 7,
      padding: "10px",
      marginTop: "10px"
    }}>
      <div style={{
        fontSize: 9,
        color: colors.text.secondary,
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
          <div style={{ fontSize: "13px", fontWeight: 600, color: colors.text.primary }}>
            {hotspot.main_area}
          </div>
          <div style={{ fontSize: "10px", color: colors.text.muted }}>
            {hotspot.sub_area}
          </div>
          <div style={{ fontSize: "10px", color: colors.text.secondary, marginTop: "4px" }}>
            {hotspot.period} • {hotspot.date}
          </div>
          <div style={{ fontSize: "9px", color: hotspot.risk.color, marginTop: "2px" }}>
            {hotspot.risk.emoji} {hotspot.risk.label} (Total: {hotspot.totalLocationQuantity || hotspot.quantity})
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            background: colors.accent.red + '22',
            color: colors.accent.red,
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
  const { colors } = useTheme();
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
    { label: t('totalLocations'), value: safeStats.total, color: colors.accent.blue },
    { label: t('murder'), value: safeStats.murders, color: colors.accent.red },
    { label: t('rape'), value: safeStats.rape, color: colors.risk.high },
    { label: t('robbery'), value: safeStats.robbery, color: "#ff4500" },
    { label: t('kidnapping'), value: safeStats.kidnapping, color: colors.risk.medium },
    { label: t('drugs'), value: safeStats.drugs, color: colors.risk.low },
    { label: t('others'), value: safeStats.others, color: colors.text.muted },
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