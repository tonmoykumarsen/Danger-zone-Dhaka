import React from "react";
import { TIME_FILTERS } from "../../constants/config";

const TimeFilterButtons = ({ currentFilter, onFilterChange }) => {
  return (
    <div style={{
      display: "flex",
      gap: "4px",
      flexWrap: "wrap",
      padding: "4px",
      background: "#0a0a14",
      borderRadius: "8px",
      border: "1px solid #1e1e30"
    }}>
      {Object.entries(TIME_FILTERS).map(([key, config]) => {
        const isActive = currentFilter === key;

        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${isActive ? config.color + "66" : "#1e1e30"}`,
              background: isActive ? `${config.color}22` : "transparent",
              color: isActive ? config.color : "#64748b",
              boxShadow: isActive ? `0 0 8px ${config.color}44` : "none",
              transition: "all 0.15s",
              fontFamily: "'Hind Siliguri', 'DM Sans', system-ui, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TimeFilterButtons;