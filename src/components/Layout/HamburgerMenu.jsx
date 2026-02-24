import React, { useState, useEffect, useRef } from "react";

const HamburgerMenu = ({ 
  crimeTypeFilter, 
  onCrimeTypeFilterChange,
  timePeriodFilter,
  onTimePeriodFilterChange,
  crimeTypeFilters,
  timePeriods,
  statistics 
}) => {
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
          background: "#0f0f1a",
          border: `1px solid ${isOpen ? "#ff2d2d66" : "#1e1e30"}`,
          borderRadius: "8px",
          color: isOpen ? "#ff2d2d" : "#94a3b8",
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
            background: "#ff2d2d",
            borderRadius: "50%",
            border: "2px solid #080810"
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
            background: "#1a1a2a",
            border: "1px solid #1e1e30",
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 2000,
            boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
            animation: "slideIn 0.3s ease"
          }}
        >
          <div style={{
            display: "flex",
            borderBottom: "1px solid #1e1e30",
            background: "#0f0f1a"
          }}>
            <button
              onClick={() => setActiveTab("filters")}
              style={{
                flex: 1,
                padding: "12px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "filters" ? "2px solid #ff2d2d" : "none",
                color: activeTab === "filters" ? "#ff2d2d" : "#64748b",
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
                borderBottom: activeTab === "stats" ? "2px solid #ff2d2d" : "none",
                color: activeTab === "stats" ? "#ff2d2d" : "#64748b",
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
                  color: "#94a3b8",
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
                      background: "#ff2d2d22",
                      color: "#ff2d2d",
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
                          background: isActive ? "#ff2d2d22" : "#0f0f1a",
                          border: `1px solid ${isActive ? "#ff2d2d66" : "#1e1e30"}`,
                          borderRadius: "6px",
                          color: isActive ? "#ff2d2d" : "#94a3b8",
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
                  color: "#94a3b8",
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
                          background: isActive ? `${period.color}22` : "#0f0f1a",
                          border: `1px solid ${isActive ? period.color + "66" : "#1e1e30"}`,
                          borderRadius: "6px",
                          color: isActive ? period.color : "#94a3b8",
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
                    background: "#ff2d2d22",
                    border: "1px solid #ff2d2d66",
                    borderRadius: "6px",
                    color: "#ff2d2d",
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
                background: "#0f0f1a",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: "#94a3b8",
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
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#60a5fa" }}>
                      {statistics.total}
                    </div>
                    <div style={{ fontSize: "9px", color: "#64748b" }}>মোট ঘটনা</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#60a5fa" }}>
                      {statistics.totalCases}
                    </div>
                    <div style={{ fontSize: "9px", color: "#64748b" }}>মোট মামলা</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: "#0f0f1a",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: "#94a3b8",
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
                  <div style={{ textAlign: "center", background: "#ff2d2d22", padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff2d2d" }}>
                      {statistics.riskCounts.critical}
                    </div>
                    <div style={{ fontSize: "8px", color: "#ff2d2d" }}>সবচেয়ে ঝুঁকিপূর্ণ</div>
                  </div>
                  <div style={{ textAlign: "center", background: "#ff6b1a22", padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b1a" }}>
                      {statistics.riskCounts.high}
                    </div>
                    <div style={{ fontSize: "8px", color: "#ff6b1a" }}>উচ্চ ঝুঁকি</div>
                  </div>
                  <div style={{ textAlign: "center", background: "#f0a50022", padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f0a500" }}>
                      {statistics.riskCounts.medium}
                    </div>
                    <div style={{ fontSize: "8px", color: "#f0a500" }}>মাঝারি ঝুঁকি</div>
                  </div>
                  <div style={{ textAlign: "center", background: "#22c55e22", padding: "8px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#22c55e" }}>
                      {statistics.riskCounts.low}
                    </div>
                    <div style={{ fontSize: "8px", color: "#22c55e" }}>নিম্ন ঝুঁকি</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: "#0f0f1a",
                borderRadius: "8px",
                padding: "12px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "12px"
                }}>
                  🔫 অপরাধের ধরন
                </div>
                {[
                  { label: "হত্যা", value: statistics.murders, color: "#ff2d2d" },
                  { label: "ধর্ষণ", value: statistics.rape, color: "#ff6b1a" },
                  { label: "ডাকাতি", value: statistics.robbery, color: "#ff4500" },
                  { label: "অপহরণ", value: statistics.kidnapping, color: "#f0a500" },
                  { label: "মাদক", value: statistics.drugs, color: "#22c55e" },
                  { label: "অন্যান্য", value: statistics.others, color: "#6b7280" }
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontSize: "11px"
                  }}>
                    <span style={{ color: "#94a3b8" }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
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