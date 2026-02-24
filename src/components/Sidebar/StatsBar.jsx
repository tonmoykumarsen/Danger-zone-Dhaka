import React from "react";
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
  const riskItems = [
    { label: "সবচেয়ে ঝুঁকিপূর্ণ", value: riskCounts.critical, color: "#ff2d2d", emoji: "🔥" },
    { label: "উচ্চ ঝুঁকি", value: riskCounts.high, color: "#ff6b1a", emoji: "⚠️" },
    { label: "মাঝারি ঝুঁকি", value: riskCounts.medium, color: "#f0a500", emoji: "⚡" },
    { label: "নিম্ন ঝুঁকি", value: riskCounts.low, color: "#22c55e", emoji: "✅" },
    { label: "স্বাভাবিক", value: riskCounts.normal, color: "#3b82f6", emoji: "ℹ️" }
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
        <span>ঝুঁকির মাত্রা অনুযায়ী</span>
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
        <span>সবচেয়ে ঝুঁকিপূর্ণ এলাকা</span>
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

      <RiskLevelIndicator riskCounts={stats.riskCounts} />
      
      <HotspotIndicator hotspot={stats.hotspot} />
    </div>
  );
};

export default StatsBar;