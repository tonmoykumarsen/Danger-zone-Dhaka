import React from "react";
import { getStatistics } from "../../utils/helpers";
import { STATS_CONFIG } from "../../constants/config";

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

const HotspotIndicator = ({ hotspot }) => {
  if (!hotspot) return null;

  return (
    <div style={{
      background: "#1a000a",
      border: "1px solid #ff2d2d2a",
      borderRadius: 7,
      padding: "6px 10px",
      fontSize: 11,
      color: "#94a3b8",
      display: "flex",
      alignItems: "center",
      gap: 6
    }}>
      <span style={{ fontSize: 13 }}>🔥</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        সবচেয়ে ঝুঁকিপূর্ণ: <strong style={{ color: "#f1f5f9" }}>
          {hotspot.main_area}
        </strong>
      </span>
      <span style={{
        background: "#ff2d2d22",
        color: "#ff2d2d",
        padding: "2px 7px",
        borderRadius: 4,
        fontWeight: 700,
        fontSize: 10,
        flexShrink: 0
      }}>
        {hotspot.quantity} টি মামলা
      </span>
    </div>
  );
};

const StatsBar = ({ zones }) => {
  const stats = getStatistics(zones);

  const statItems = [
    { label: "মোট অবস্থান", value: stats.total, color: "#60a5fa" },
    { label: "হত্যা", value: stats.murders, color: "#ff2d2d" },
    { label: "ধর্ষণ", value: stats.rape, color: "#ff6b1a" },
    { label: "ডাকাতি", value: stats.robbery, color: "#ff4500" },
    { label: "অপহরণ", value: stats.kidnapping, color: "#f0a500" },
    { label: "মাদক", value: stats.drugs, color: "#22c55e" },
    { label: "অন্যান্য", value: stats.others, color: "#6b7280" },
  ];

  return (
    <div style={{ marginBottom: 12 }}>
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
      
      <HotspotIndicator hotspot={stats.hotspot} />
    </div>
  );
};

export default StatsBar;