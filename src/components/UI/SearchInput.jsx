import React, { useState } from "react";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
      <span style={{
        position: "absolute", left: 10, top: "50%",
        transform: "translateY(-50%)", fontSize: 12,
        color: "#475569", pointerEvents: "none"
      }}>
        🔍
      </span>
      
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "7px 55px 7px 30px",
          background: "#0f0f1a",
          border: `1px solid ${isFocused ? "#ff2d2d55" : "#1e1e30"}`,
          borderRadius: 8, fontSize: 12, color: "#e2e8f0", outline: "none",
          boxShadow: isFocused ? "0 0 0 2px #ff2d2d1a" : "none",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "all 0.2s"
        }}
      />
      
      <span style={{
        position: "absolute", right: 8, top: "50%",
        transform: "translateY(-50%)", fontSize: 9,
        padding: "2px 5px", borderRadius: 3,
        border: "1px solid #1e1e30", color: "#475569",
        background: "#0a0a14", pointerEvents: "none"
      }}>
        ⌘ K
      </span>
    </div>
  );
};

export default SearchInput;