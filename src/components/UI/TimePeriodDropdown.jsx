import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { TIME_PERIODS } from "../../constants/config";

const TimePeriodDropdown = ({ currentFilter, onFilterChange }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentPeriod = TIME_PERIODS.find(p => p.value === currentFilter) || TIME_PERIODS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get translated label for a period
  const getTranslatedLabel = (period) => {
    if (language === 'bn') {
      return period.label; // Bengali labels are already in the data
    } else {
      // For English, map to translations
      const translationMap = {
        "সব সময়": "All Time",
        "সকাল (৬-১২টা)": "Morning (6am-12pm)",
        "দুপুর (১২-৩টা)": "Noon (12pm-3pm)",
        "বিকাল (৩-৬টা)": "Afternoon (3pm-6pm)",
        "সন্ধ্যা (৬-৮টা)": "Evening (6pm-8pm)",
        "রাত (৮-১২টা)": "Night (8pm-12am)",
        "মধ্যরাত (১২-৬টা)": "Midnight (12am-6am)",
        "ভোর (৪-৬টা)": "Dawn (4am-6am)",
        "অজানা": "Unknown"
      };
      return translationMap[period.label] || period.label;
    }
  };

  return (
    <div className="time-dropdown" ref={dropdownRef} style={{ position: "relative", minWidth: "200px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: "#0f0f1a",
          border: `1px solid ${isOpen ? currentPeriod.color + "66" : "#1e1e30"}`,
          borderRadius: "8px",
          color: "#e2e8f0",
          fontSize: "12px",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          transition: "all 0.2s"
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: currentPeriod.color, fontSize: "14px" }}>{currentPeriod.icon}</span>
          <span>{getTranslatedLabel(currentPeriod)}</span>
        </span>
        <span style={{ color: "#64748b", fontSize: "10px" }}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: "#1a1a2a",
            border: "1px solid #1e1e30",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }}
        >
          {TIME_PERIODS.map((period) => {
            const isActive = currentFilter === period.value;

            return (
              <button
                key={period.value}
                onClick={() => {
                  onFilterChange(period.value);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: isActive ? `${period.color}22` : "transparent",
                  border: "none",
                  borderBottom: "1px solid #1e1e30",
                  color: isActive ? period.color : "#94a3b8",
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#2a2a3a";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ color: period.color, width: "20px", fontSize: "12px" }}>{period.icon}</span>
                <span style={{ flex: 1 }}>{getTranslatedLabel(period)}</span>
                {isActive && <span style={{ color: period.color }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {currentFilter !== "সব সময়" && (
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: currentPeriod.color,
            borderRadius: "20px",
            padding: "2px 6px",
            fontSize: "9px",
            fontWeight: 600,
            color: "#000",
            border: "2px solid #0a0a14",
            zIndex: 2
          }}
        >
          {language === 'bn' ? 'সক্রিয়' : 'Active'}
        </div>
      )}
    </div>
  );
};

export default TimePeriodDropdown;