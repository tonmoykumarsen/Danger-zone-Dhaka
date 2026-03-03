// components/UI/SearchInput.js (updated with theme)
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const SearchInput = ({ value, onChange, placeholder = "Search...", compact = false }) => {
  const { colors } = useTheme();
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
            background: colors.surface2,
            border: `1px solid ${isFocused ? colors.accent.red + '55' : colors.border}`,
            borderRadius: 20,
            fontSize: 11,
            color: colors.text.primary,
            outline: "none",
            boxShadow: isFocused ? `0 0 0 2px ${colors.accent.red}1a` : "none",
            transition: "all 0.2s"
          }}
        />
        <span style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 11,
          color: colors.text.muted,
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
        color: colors.text.muted, pointerEvents: "none"
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
          background: colors.surface2,
          border: `1px solid ${isFocused ? colors.accent.red + '55' : colors.border}`,
          borderRadius: 8,
          fontSize: 13,
          color: colors.text.primary,
          outline: "none",
          boxShadow: isFocused ? `0 0 0 2px ${colors.accent.red}1a` : "none",
          transition: "all 0.2s"
        }}
      />
      
      <span style={{
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)", fontSize: 10,
        padding: "2px 6px", borderRadius: 4,
        border: `1px solid ${colors.border}`, color: colors.text.muted,
        background: colors.surface, pointerEvents: "none"
      }}>
        ⌘K
      </span>
    </div>
  );
};

export default SearchInput;