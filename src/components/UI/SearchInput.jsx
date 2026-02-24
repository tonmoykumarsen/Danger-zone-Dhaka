import React, { useState } from "react";

const SearchInput = ({ value, onChange, placeholder = "Search...", compact = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  if (compact) {
    return (
      <div style={{ position: "relative", width: "160px" }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "8px 30px 8px 30px",
            background: "#0f0f1a",
            border: `1px solid ${isFocused ? "#ff2d2d55" : "#1e1e30"}`,
            borderRadius: 20,
            fontSize: 11,
            color: "#e2e8f0",
            outline: "none",
            boxShadow: isFocused ? "0 0 0 2px #ff2d2d1a" : "none",
            transition: "all 0.2s"
          }}
        />
        <span style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 11,
          color: "#475569",
          pointerEvents: "none"
        }}>
          🔍
        </span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
      <span style={{
        position: "absolute", left: 12, top: "50%",
        transform: "translateY(-50%)", fontSize: 13,
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
          width: "100%",
          padding: "10px 40px 10px 35px",
          background: "#0f0f1a",
          border: `1px solid ${isFocused ? "#ff2d2d55" : "#1e1e30"}`,
          borderRadius: 8,
          fontSize: 13,
          color: "#e2e8f0",
          outline: "none",
          boxShadow: isFocused ? "0 0 0 2px #ff2d2d1a" : "none",
          transition: "all 0.2s"
        }}
      />
      
      <span style={{
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)", fontSize: 10,
        padding: "2px 6px", borderRadius: 4,
        border: "1px solid #1e1e30", color: "#475569",
        background: "#0a0a14", pointerEvents: "none"
      }}>
        ⌘K
      </span>
    </div>
  );
};

export default SearchInput;