// components/Layout/HamburgerMenu.js (updated with theme)
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

const HamburgerMenu = ({ 
  crimeTypeFilter, 
  onCrimeTypeFilterChange,
  timePeriodFilter,
  onTimePeriodFilterChange,
  crimeTypeFilters,
  timePeriods,
  statistics 
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [activeTab, setActiveTab] = useState("filters");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTimePeriod = timePeriods.find(p => p.value === timePeriodFilter) || timePeriods[0];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hamburger-btn"
        style={{
          width: "40px",
          height: "40px",
          background: colors.surface2,
          border: `1px solid ${isOpen ? colors.accent.red + '66' : colors.border}`,
          borderRadius: "8px",
          color: isOpen ? colors.accent.red : colors.text.secondary,
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          position: "relative"
        }}
      >
        ☰
        {(crimeTypeFilter !== "সবগুলো" || timePeriodFilter !== "সব সময়") && (
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "10px",
            height: "10px",
            background: colors.accent.red,
            borderRadius: "50%",
            border: `2px solid ${colors.surface}`
          }} />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="mobile-menu"
          style={{
            position: "fixed",
            top: "70px",
            right: "12px",
            width: "300px",
            maxHeight: "calc(100vh - 90px)",
            background: colors.surface2,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 2000,
            boxShadow: colors.shadow,
            animation: "slideIn 0.3s ease"
          }}
        >
          <div style={{
            display: "flex",
            borderBottom: `1px solid ${colors.border}`,
            background: colors.surface
          }}>
            <button
              onClick={() => setActiveTab("filters")}
              style={{
                flex: 1,
                padding: "12px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "filters" ? `2px solid ${colors.accent.red}` : "none",
                color: activeTab === "filters" ? colors.accent.red : colors.text.muted,
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🎯 ফিল্টার
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              style={{
                flex: 1,
                padding: "12px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "stats" ? `2px solid ${colors.accent.red}` : "none",
                color: activeTab === "stats" ? colors.accent.red : colors.text.muted,
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              📊 পরিসংখ্যান
            </button>
          </div>

          {activeTab === "filters" && (
            <div style={{ padding: "16px", overflowY: "auto", maxHeight: "400px" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  fontSize: "11px",
                  color: colors.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span>🔫 অপরাধের ধরন</span>
                  {crimeTypeFilter !== "সবগুলো" && (
                    <span style={{
                      background: `${colors.accent.red}22`,
                      color: colors.accent.red,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "9px"
                    }}>
                      {crimeTypeFilter}
                    </span>
                  )}
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "6px"
                }}>
                  {crimeTypeFilters.map((filter) => {
                    const isActive = crimeTypeFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => onCrimeTypeFilterChange(filter)}
                        style={{
                          padding: "8px",
                          background: isActive ? `${colors.accent.red}22` : colors.surface,
                          border: `1px solid ${isActive ? colors.accent.red + '66' : colors.border}`,
                          borderRadius: "6px",
                          color: isActive ? colors.accent.red : colors.text.secondary,
                          fontSize: "11px",
                          fontWeight: isActive ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "11px",
                  color: colors.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span>⏰ সময়</span>
                  {timePeriodFilter !== "সব সময়" && (
                    <span style={{
                      background: `${currentTimePeriod.color}22`,
                      color: currentTimePeriod.color,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "9px"
                    }}>
                      {currentTimePeriod.label}
                    </span>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}>
                  {timePeriods.map((period) => {
                    const isActive = timePeriodFilter === period.value;
                    return (
                      <button
                        key={period.value}
                        onClick={() => onTimePeriodFilterChange(period.value)}
                        style={{
                          padding: "10px",
                          background: isActive ? `${period.color}22` : colors.surface,
                          border: `1px solid ${isActive ? period.color + '66' : colors.border}`,
                          borderRadius: "6px",
                          color: isActive ? period.color : colors.text.secondary,
                          fontSize: "11px",
                          fontWeight: isActive ? 600 : 400,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.2s"
                        }}
                      >
                        <span style={{ color: period.color }}>{period.icon}</span>
                        <span style={{ flex: 1, textAlign: "left" }}>{period.label}</span>
                        {isActive && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(crimeTypeFilter !== "সবগুলো" || timePeriodFilter !== "সব সময়") && (
                <button
                  onClick={() => {
                    onCrimeTypeFilterChange("সবগুলো");
                    onTimePeriodFilterChange("সব সময়");
                  }}
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    padding: "10px",
                    background: `${colors.accent.red}22`,
                    border: `1px solid ${colors.accent.red}66`,
                    borderRadius: "6px",
                    color: colors.accent.red,
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>🗑️</span>
                  <span>সব ফিল্টার রিসেট করুন</span>
                </button>
              )}
            </div>
          )}

          {activeTab === "stats" && statistics && (
            <div style={{ padding: "16px", overflowY: "auto", maxHeight: "400px" }}>
              <div style={{
                background: colors.surface,
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: colors.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "12px"
                }}>
                  📈 দ্রুত পরিসংখ্যান
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: colors.accent.blue }}>
                      {statistics.total}
                    </div>
                    <div style={{ fontSize: "9px", color: colors.text.muted }}>মোট ঘটনা</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: colors.accent.blue }}>
                      {statistics.totalCases}
                    </div>
                    <div style={{ fontSize: "9px", color: colors.text.muted }}>মোট মামলা</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: colors.surface,
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: colors.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "12px"
                }}>
                  ⚠️ ঝুঁকির মাত্রা
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px"
                }}>
                  <div style={{ textAlign: "center", background: `${colors.risk.critical}22`, padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.risk.critical }}>
                      {statistics.riskCounts.critical}
                    </div>
                    <div style={{ fontSize: "8px", color: colors.risk.critical }}>সবচেয়ে ঝুঁকিপূর্ণ</div>
                  </div>
                  <div style={{ textAlign: "center", background: `${colors.risk.high}22`, padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.risk.high }}>
                      {statistics.riskCounts.high}
                    </div>
                    <div style={{ fontSize: "8px", color: colors.risk.high }}>উচ্চ ঝুঁকি</div>
                  </div>
                  <div style={{ textAlign: "center", background: `${colors.risk.medium}22`, padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.risk.medium }}>
                      {statistics.riskCounts.medium}
                    </div>
                    <div style={{ fontSize: "8px", color: colors.risk.medium }}>মাঝারি ঝুঁকি</div>
                  </div>
                  <div style={{ textAlign: "center", background: `${colors.risk.low}22`, padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.risk.low }}>
                      {statistics.riskCounts.low}
                    </div>
                    <div style={{ fontSize: "8px", color: colors.risk.low }}>নিম্ন ঝুঁকি</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default HamburgerMenu;