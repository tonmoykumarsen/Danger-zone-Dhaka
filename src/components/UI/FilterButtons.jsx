import React from "react";
import { FILTER_OPTIONS } from "../../constants/config";
import { getTypeConfig } from "../../utils/helpers";

const FilterButtons = ({ currentFilter, onFilterChange }) => {
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {FILTER_OPTIONS.map((filter) => {
        const config = filter === "All" ? null : getTypeConfig(filter);
        const isActive = currentFilter === filter;
        const color = config?.color || "#60a5fa";

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: "4px 10px", borderRadius: 100, fontSize: 9.5,
              fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.07em", cursor: "pointer",
              border: `1px solid ${isActive ? color + "66" : "#1e1e30"}`,
              background: isActive ? `${color}22` : "#0f0f1a",
              color: isActive ? color : "#64748b",
              boxShadow: isActive ? `0 0 8px ${color}44` : "none",
              transition: "all 0.15s",
              fontFamily: "'DM Sans', system-ui, sans-serif"
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;