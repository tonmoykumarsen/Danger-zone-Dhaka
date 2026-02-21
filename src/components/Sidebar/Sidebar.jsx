import React from "react";
import StatsBar from "./StatsBar";
import ZoneCard from "./ZoneCard";

const Sidebar = ({ zones, activeZoneIndex, onZoneClick }) => {
  return (
    <div style={{
      width: 300,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      background: "#0a0a14",
      borderRight: "1px solid #1a1a2e",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 12px 10px",
        borderBottom: "1px solid #1a1a2e",
        background: "#0d0d18",
        flexShrink: 0
      }}>
        <div style={{
          fontSize: 10.5,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10
        }}>
          📍 Zones — <strong style={{ color: "#e2e8f0" }}>{zones.length}</strong> results
        </div>
        
        <StatsBar zones={zones} />
      </div>

      {/* Zone list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
        {zones.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "#334155"
          }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🔎</div>
            <div style={{ fontSize: 13 }}>No zones match your filters</div>
          </div>
        ) : (
          zones.map((zone, index) => (
            <ZoneCard
              key={index}
              zone={zone}
              index={index}
              active={activeZoneIndex === index}
              onClick={() => onZoneClick(index)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;