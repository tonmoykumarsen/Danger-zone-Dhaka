// components/Sidebar/Sidebar.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import StatsBar from "./StatsBar";
import ZoneCard from "./ZoneCard";
import { getRiskLevel } from "../../utils/helpers";

const Sidebar = ({ 
  zones, 
  activeZoneIndex, 
  onZoneClick, 
  onZoneHover,
  statistics,
  timePeriodStatistics,
  currentTimePeriodFilter,
  sortBy,
  sortOrder,
  onSort,
  onClose 
}) => {
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const [viewMode, setViewMode] = useState('district');
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [expandedDates, setExpandedDates] = useState({});
  const hoverTimeoutRef = useRef(null);
  const popupRef = useRef(null);
  const expandTimeoutRef = useRef(null);
  
  // Process district data with total quantity per location
  const districtData = useMemo(() => {
    const districts = {};
    
    // First, calculate total quantity per location
    const locationTotalMap = {};
    zones.forEach(zone => {
      const location = zone.main_area;
      locationTotalMap[location] = (locationTotalMap[location] || 0) + (zone.quantity || 0);
    });
    
    zones.forEach(zone => {
      const district = zone.main_area;
      const totalLocationQty = locationTotalMap[district] || zone.quantity;
      const riskLevel = getRiskLevel(totalLocationQty);
      
      if (!districts[district]) {
        districts[district] = {
          crimes: 0,
          totalCases: 0,
          totalLocationQuantity: totalLocationQty,
          crimeTypes: {},
          zones: [],
          riskLevels: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            normal: 0
          },
          history: []
        };
      }
      
      districts[district].crimes++;
      districts[district].totalCases += zone.quantity;
      districts[district].zones.push(zone);
      districts[district].history.push({
        type: zone.type,
        typeConfig: zone.typeConfig,
        quantity: zone.quantity,
        date: zone.date,
        period: zone.period,
        risk: zone.risk,
        totalLocationQty: totalLocationQty
      });
      
      // Update risk levels based on total location quantity
      const riskLabel = riskLevel.label;
      if (riskLabel === "সবচেয়ে ঝুঁকিপূর্ণ" || riskLabel === "Critical") {
        districts[district].riskLevels.critical++;
      } else if (riskLabel === "উচ্চ ঝুঁকি" || riskLabel === "High Risk") {
        districts[district].riskLevels.high++;
      } else if (riskLabel === "মাঝারি ঝুঁকি" || riskLabel === "Medium Risk") {
        districts[district].riskLevels.medium++;
      } else if (riskLabel === "নিম্ন ঝুঁকি" || riskLabel === "Low Risk") {
        districts[district].riskLevels.low++;
      } else {
        districts[district].riskLevels.normal++;
      }
      
      const type = zone.type;
      if (!districts[district].crimeTypes[type]) {
        districts[district].crimeTypes[type] = {
          count: 0,
          quantity: 0,
          color: zone.typeConfig.color
        };
      }
      districts[district].crimeTypes[type].count++;
      districts[district].crimeTypes[type].quantity += zone.quantity;
    });
    
    // Sort history by date (most recent first)
    Object.keys(districts).forEach(key => {
      districts[key].history.sort((a, b) => b.date.localeCompare(a.date));
    });
    
    return districts;
  }, [zones]);

  const timelineData = useMemo(() => {
    const timeline = {};
    zones.forEach(zone => {
      const date = zone.date;
      if (!timeline[date]) {
        timeline[date] = [];
      }
      timeline[date].push(zone);
    });
    return Object.entries(timeline).sort((a, b) => b[0].localeCompare(a[0]));
  }, [zones]);

  const locationHistory = useMemo(() => {
    const history = {};
    
    // First calculate total per location
    const locationTotalMap = {};
    zones.forEach(zone => {
      const location = zone.main_area;
      locationTotalMap[location] = (locationTotalMap[location] || 0) + (zone.quantity || 0);
    });
    
    zones.forEach(zone => {
      const location = zone.main_area;
      const totalQty = locationTotalMap[location] || zone.quantity;
      
      if (!history[location]) {
        history[location] = [];
      }
      history[location].push({
        ...zone,
        totalLocationQuantity: totalQty
      });
    });
    
    // Sort by date (most recent first)
    Object.keys(history).forEach(key => {
      history[key].sort((a, b) => b.date.localeCompare(a.date));
    });
    
    return history;
  }, [zones]);

  const getDistrictRiskLevel = (district) => {
    const data = districtData[district];
    if (!data) return { label: t('normal'), color: colors.risk.normal, emoji: "ℹ️" };
    
    // Determine district risk based on highest risk level present
    if (data.riskLevels.critical > 0) {
      return { label: t('critical'), color: colors.risk.critical, emoji: "🔥" };
    }
    if (data.riskLevels.high > 0) {
      return { label: t('high'), color: colors.risk.high, emoji: "⚠️" };
    }
    if (data.riskLevels.medium > 0) {
      return { label: t('medium'), color: colors.risk.medium, emoji: "⚡" };
    }
    if (data.riskLevels.low > 0) {
      return { label: t('low'), color: colors.risk.low, emoji: "✅" };
    }
    return { label: t('normal'), color: colors.risk.normal, emoji: "ℹ️" };
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Handle mouse enter on district - auto expand
  const handleDistrictMouseEnter = (district, event) => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }
    
    setHoveredDistrict(district);
    setExpandedDistrict(district);
    handleLocationHover(district, event);
  };

  // Handle mouse leave on district - auto collapse with delay
  const handleDistrictMouseLeave = () => {
    setHoveredDistrict(null);
    
    expandTimeoutRef.current = setTimeout(() => {
      setExpandedDistrict(null);
    }, 300);
    
    handleLocationLeave();
  };

  // Handle mouse enter on expanded content - prevent collapse
  const handleExpandedContentMouseEnter = () => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }
  };

  // Handle mouse leave on expanded content - allow collapse
  const handleExpandedContentMouseLeave = () => {
    expandTimeoutRef.current = setTimeout(() => {
      setExpandedDistrict(null);
    }, 300);
  };

  // Handle mouse enter on location for popup
  const handleLocationHover = (location, event) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    const rect = event.currentTarget.getBoundingClientRect();
    const sidebarRect = event.currentTarget.closest('.sidebar').getBoundingClientRect();
    
    setHoverPosition({
      x: Math.min(rect.right - sidebarRect.left + 10, 300), // Prevent going off screen
      y: rect.top - sidebarRect.top
    });
    setHoveredLocation(location);
  };

  // Handle mouse leave from location popup
  const handleLocationLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredLocation(null);
    }, 200);
  };

  // Handle mouse enter on popup
  const handlePopupEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Handle mouse leave on popup
  const handlePopupLeave = () => {
    setHoveredLocation(null);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    };
  }, []);

  const viewModes = [
    { id: 'district', label: t('district'), icon: '🏛️' },
    { id: 'heatmap', label: t('heatmap'), icon: '🔥' },
    { id: 'timeline', label: t('timeline'), icon: '📅' },
    { id: 'list', label: t('list'), icon: '📋' }
  ];

  // Calculate total cases per location for risk display
  const getLocationTotal = (location) => {
    const locationZones = zones.filter(z => z.main_area === location);
    return locationZones.reduce((sum, z) => sum + (z.quantity || 0), 0);
  };

  return (
    <div className="sidebar" style={{
      width: 380,
      display: 'flex',
      flexDirection: 'column',
      background: colors.surface,
      borderRight: `1px solid ${colors.border}`,
      overflow: 'hidden',
      position: 'relative',
      height: '100%'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${colors.border}`,
        background: colors.surface2,
        flexShrink: 0
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h2 style={{ fontSize: '18px', color: colors.text.primary, margin: 0 }}>
            {t('bangladeshCrimeMap')}
          </h2>
          
          {onClose && (
            <button
              onClick={onClose}
              className="close-btn"
              style={{
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                color: colors.text.secondary,
                width: '32px',
                height: '32px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.surface3}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ✕
            </button>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '4px',
          background: colors.surface,
          padding: '4px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          marginBottom: '12px'
        }}>
          {viewModes.map(mode => {
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className="view-mode-btn"
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: isActive ? colors.surface3 : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: isActive ? colors.text.primary : colors.text.muted,
                  fontSize: '11px',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = colors.surface2;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{mode.icon}</span>
                <span className="mode-label">{mode.label}</span>
              </button>
            );
          })}
        </div>
        
        <StatsBar zones={zones} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', position: 'relative' }}>
        {/* Hover History Popup */}
        {hoveredLocation && locationHistory[hoveredLocation] && (
          <div
            ref={popupRef}
            onMouseEnter={handlePopupEnter}
            onMouseLeave={handlePopupLeave}
            style={{
              position: 'absolute',
              left: hoverPosition.x,
              top: hoverPosition.y,
              width: '280px',
              maxWidth: '90vw',
              background: colors.surface2,
              border: `1px solid ${colors.accent.red}66`,
              borderRadius: '12px',
              padding: '16px',
              zIndex: 1000,
              boxShadow: colors.shadow,
              animation: 'fadeIn 0.2s ease',
              pointerEvents: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              borderBottom: `1px solid ${colors.border}`,
              paddingBottom: '8px'
            }}>
              <h3 style={{ fontSize: '14px', color: colors.text.primary, margin: 0 }}>
                📍 {hoveredLocation}
              </h3>
              <span style={{
                background: `${colors.accent.red}22`,
                color: colors.accent.red,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 600
              }}>
                {locationHistory[hoveredLocation].length}{language === 'bn' ? 'টি ঘটনা' : ' events'}
              </span>
            </div>
            
            {/* Total Cases for this location */}
            <div style={{
              background: colors.surface,
              borderRadius: '6px',
              padding: '8px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '10px', color: colors.text.secondary }}>
                {language === 'bn' ? 'মোট মামলা:' : 'Total Cases:'}
              </span>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: locationHistory[hoveredLocation][0]?.risk?.color || colors.accent.red
              }}>
                {getLocationTotal(hoveredLocation)}
              </span>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {locationHistory[hoveredLocation].slice(0, 5).map((crime, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px',
                    marginBottom: '8px',
                    background: colors.surface,
                    borderRadius: '8px',
                    borderLeft: `4px solid ${crime.typeConfig.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    const index = zones.findIndex(z => z.id === crime.id);
                    if (index !== -1) onZoneClick(index);
                    setHoveredLocation(null);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.surface2;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.surface;
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: colors.text.primary }}>
                      {crime.typeConfig.icon} {language === 'bn' ? crime.type : crime.typeConfig.description?.split('/')[0]?.trim() || crime.type}
                    </span>
                    <span style={{ fontSize: '11px', color: crime.risk.color }}>
                      {crime.risk.emoji} {language === 'bn' ? crime.risk.label : {
                        "সবচেয়ে ঝুঁকিপূর্ণ": "Critical",
                        "উচ্চ ঝুঁকি": "High",
                        "মাঝারি ঝুঁকি": "Medium",
                        "নিম্ন ঝুঁকি": "Low",
                        "স্বাভাবিক": "Normal"
                      }[crime.risk.label] || crime.risk.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: colors.text.muted, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span>{crime.date}</span>
                    <span>•</span>
                    <span>{crime.period}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 600, color: crime.typeConfig.color }}>{crime.quantity}{language === 'bn' ? 'টি' : ''}</span>
                  </div>
                </div>
              ))}
              
              {locationHistory[hoveredLocation].length > 5 && (
                <div style={{
                  fontSize: '10px',
                  color: colors.text.muted,
                  textAlign: 'center',
                  padding: '8px',
                  background: colors.surface,
                  borderRadius: '6px',
                  marginTop: '4px'
                }}>
                  {language === 'bn' 
                    ? `+ ${locationHistory[hoveredLocation].length - 5}টি আরও ঘটনা...`
                    : `+ ${locationHistory[hoveredLocation].length - 5} more events...`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DISTRICT VIEW */}
        {viewMode === 'district' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '12px',
              color: colors.text.muted,
              padding: '0 4px'
            }}>
              <span>{t('totalDistricts', { count: Object.keys(districtData).length })}</span>
              <span>{t('byCases')}</span>
            </div>
            
            {Object.entries(districtData)
              .sort((a, b) => b[1].totalCases - a[1].totalCases)
              .map(([district, data]) => {
                const districtRisk = getDistrictRiskLevel(district);
                const isHovered = hoveredDistrict === district;
                const isExpanded = expandedDistrict === district;
                const totalLocationQty = data.totalLocationQuantity || data.totalCases;

                return (
                  <div
                    key={district}
                    className="district-item"
                    onMouseEnter={(e) => handleDistrictMouseEnter(district, e)}
                    onMouseLeave={handleDistrictMouseLeave}
                    style={{
                      marginBottom: '12px',
                      borderRadius: '10px',
                      background: isHovered ? colors.surface2 : colors.surface,
                      border: `1px solid ${isHovered ? districtRisk.color + '66' : colors.border}`,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'translateX(4px)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      padding: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            color: colors.text.primary, 
                            margin: 0 
                          }}>
                            {district}
                          </h3>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            background: districtRisk.color + '22',
                            color: districtRisk.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <span>{districtRisk.emoji}</span>
                            <span>{districtRisk.label}</span>
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: colors.text.muted }}>
                          <span>{data.crimes}{t('locations')} • </span>
                          <span style={{ color: colors.accent.red, fontWeight: '600' }}>{totalLocationQty}</span>
                          <span>{t('cases')} total</span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div 
                        onMouseEnter={handleExpandedContentMouseEnter}
                        onMouseLeave={handleExpandedContentMouseLeave}
                        style={{ 
                          padding: '0 14px 14px 14px',
                          animation: 'slideDown 0.2s ease'
                        }}
                      >
                        <div style={{
                          background: colors.surface,
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '10px'
                        }}>
                          <div style={{ 
                            fontSize: '10px', 
                            color: colors.text.muted, 
                            marginBottom: '8px', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {t('riskLevel')}
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px'
                          }}>
                            {data.riskLevels.critical > 0 && (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.risk.critical }}>
                                  {data.riskLevels.critical}
                                </div>
                                <div style={{ fontSize: '8px', color: colors.text.muted }}>{t('criticalRisk')}</div>
                              </div>
                            )}
                            {data.riskLevels.high > 0 && (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.risk.high }}>
                                  {data.riskLevels.high}
                                </div>
                                <div style={{ fontSize: '8px', color: colors.text.muted }}>{t('highRisk')}</div>
                              </div>
                            )}
                            {data.riskLevels.medium > 0 && (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.risk.medium }}>
                                  {data.riskLevels.medium}
                                </div>
                                <div style={{ fontSize: '8px', color: colors.text.muted }}>{t('mediumRisk')}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{
                          background: colors.surface,
                          borderRadius: '8px',
                          padding: '12px'
                        }}>
                          <div style={{ 
                            fontSize: '10px', 
                            color: colors.text.muted, 
                            marginBottom: '8px', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {t('crimeType')}
                          </div>
                          {Object.entries(data.crimeTypes).map(([type, typeData]) => (
                            <div key={type} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '6px',
                              fontSize: '11px',
                              padding: '4px 0',
                              borderBottom: `1px solid ${colors.border}`
                            }}>
                              <span style={{ color: typeData.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {type}
                              </span>
                              <span style={{ color: colors.text.secondary }}>
                                {typeData.quantity}{t('cases')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Recent History */}
                        <div style={{
                          background: colors.surface,
                          borderRadius: '8px',
                          padding: '12px',
                          marginTop: '10px'
                        }}>
                          <div style={{ 
                            fontSize: '10px', 
                            color: colors.text.muted, 
                            marginBottom: '8px', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>📋</span>
                            <span>{t('recentEvents')}</span>
                          </div>
                          {data.history.slice(0, 3).map((item, idx) => (
                            <div key={idx} style={{
                              padding: '8px',
                              marginBottom: '6px',
                              background: colors.surface,
                              borderRadius: '6px',
                              fontSize: '10px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ color: item.typeConfig?.color || colors.text.secondary }}>
                                  {item.typeConfig?.icon} {language === 'bn' ? item.type : item.typeConfig?.description?.split('/')[0]?.trim() || item.type}
                                </span>
                                <span style={{ color: item.risk.color }}>
                                  {item.risk.emoji} {item.quantity}
                                </span>
                              </div>
                              <div style={{ color: colors.text.muted }}>
                                {item.date} • {item.period}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* HEATMAP VIEW */}
        {viewMode === 'heatmap' && (
          <div>
            <div style={{ 
              marginBottom: '12px', 
              fontSize: '11px', 
              color: colors.text.muted,
              padding: '0 4px'
            }}>
              {language === 'bn' ? 'লাল রঙের গভীরতা = ঝুঁকির মাত্রা' : 'Red intensity = risk level'}
            </div>
            {Object.entries(districtData)
              .sort((a, b) => b[1].totalCases - a[1].totalCases)
              .map(([district, data]) => {
                const totalQty = data.totalLocationQuantity || data.totalCases;
                const intensity = Math.min(totalQty / 100, 1);
                const districtRisk = getDistrictRiskLevel(district);
                const isHovered = hoveredDistrict === district;

                return (
                  <div
                    key={district}
                    className="heatmap-item"
                    onMouseEnter={(e) => {
                      setHoveredDistrict(district);
                      handleLocationHover(district, e);
                    }}
                    onMouseLeave={handleLocationLeave}
                    style={{
                      padding: '14px',
                      marginBottom: '10px',
                      borderRadius: '10px',
                      background: `linear-gradient(90deg, ${districtRisk.color}${Math.floor(intensity * 100)} 0%, ${colors.surface} ${intensity * 100}%)`,
                      border: `1px solid ${isHovered ? districtRisk.color + '66' : colors.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'translateX(4px)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: colors.text.primary }}>{district}</h4>
                          <span style={{
                            fontSize: '9px',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            background: districtRisk.color + '22',
                            color: districtRisk.color
                          }}>
                            {districtRisk.emoji}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: colors.text.secondary }}>
                          {data.crimes}{t('locations')} • {totalQty}{t('cases')} total
                        </span>
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: districtRisk.color,
                        textShadow: `0 0 10px ${districtRisk.color}`
                      }}>
                        {totalQty}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* TIMELINE VIEW */}
        {viewMode === 'timeline' && (
          <div>
            <div style={{ 
              marginBottom: '12px', 
              fontSize: '11px', 
              color: colors.text.muted,
              padding: '0 4px'
            }}>
              {language === 'bn' ? 'তারিখ অনুযায়ী সাজানো (সর্বশেষ ২০টি)' : 'Sorted by date (last 20)'}
            </div>
            {timelineData.slice(0, 20).map(([date, crimes]) => {
              const isExpanded = expandedDates[date] || false;
              const totalCases = crimes.reduce((sum, c) => sum + c.quantity, 0);
              const hasCritical = crimes.some(c => c.risk.label === "সবচেয়ে ঝুঁকিপূর্ণ" || c.risk.label === "Critical");

              return (
                <div key={date} style={{ marginBottom: '12px' }}>
                  <div style={{
                    background: colors.surface,
                    borderRadius: '10px',
                    border: `1px solid ${hasCritical ? colors.accent.red + '66' : colors.border}`,
                    overflow: 'hidden'
                  }}>
                    <div
                      onClick={() => toggleDateExpansion(date)}
                      style={{
                        padding: '12px 14px',
                        background: colors.surface2,
                        borderBottom: isExpanded ? `1px solid ${colors.border}` : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = colors.surface3}
                      onMouseLeave={(e) => e.currentTarget.style.background = colors.surface2}
                    >
                      <div>
                        <span style={{ fontWeight: '600', color: colors.text.primary, fontSize: '13px' }}>{date}</span>
                        <span style={{ marginLeft: '8px', fontSize: '11px', color: colors.text.muted }}>
                          {crimes.length}{language === 'bn' ? 'টি ঘটনা' : ' events'} • {totalCases}{t('cases')}
                        </span>
                      </div>
                      <span style={{ color: colors.text.secondary, fontSize: '12px' }}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '10px' }}>
                        {crimes.map((crime, idx) => (
                          <div
                            key={idx}
                            onClick={() => onZoneClick(zones.indexOf(crime))}
                            onMouseEnter={(e) => {
                              onZoneHover(crime);
                              handleLocationHover(crime.main_area, e);
                            }}
                            onMouseLeave={handleLocationLeave}
                            style={{
                              padding: '10px 12px',
                              marginBottom: '6px',
                              background: colors.surface,
                              borderRadius: '8px',
                              fontSize: '11px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              borderLeft: `4px solid ${crime.typeConfig.color}`,
                              transition: 'all 0.2s',
                              border: `1px solid transparent`
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontWeight: '600', color: colors.text.primary }}>{crime.main_area}</span>
                                <span style={{
                                  fontSize: '9px',
                                  padding: '2px 4px',
                                  borderRadius: '4px',
                                  background: crime.risk.color + '22',
                                  color: crime.risk.color
                                }}>
                                  {crime.risk.emoji} {language === 'bn' ? crime.risk.label : {
                                    "সবচেয়ে ঝুঁকিপূর্ণ": "Critical",
                                    "উচ্চ ঝুঁকি": "High",
                                    "মাঝারি ঝুঁকি": "Medium",
                                    "নিম্ন ঝুঁকি": "Low",
                                    "স্বাভাবিক": "Normal"
                                  }[crime.risk.label] || crime.risk.label}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', color: colors.text.muted }}>
                                <span>{crime.period}</span>
                                <span>•</span>
                                <span>{crime.typeConfig.icon} {language === 'bn' ? crime.type : crime.typeConfig.description?.split('/')[0]?.trim() || crime.type}</span>
                              </div>
                            </div>
                            <div style={{ 
                              fontSize: '16px', 
                              fontWeight: 'bold', 
                              color: crime.typeConfig.color,
                              minWidth: '40px',
                              textAlign: 'center'
                            }}>
                              {crime.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '11px',
              color: colors.text.muted,
              padding: '0 4px'
            }}>
              <span>{language === 'bn' ? `মোট ${zones.length}টি ঘটনা` : `Total ${zones.length} events`}</span>
              <span>{language === 'bn' ? 'ঝুঁকি অনুযায়ী সাজানো' : 'Sorted by risk'}</span>
            </div>
            {zones
              .sort((a, b) => b.quantity - a.quantity)
              .map((zone, index) => (
                <div
                  key={index}
                  onMouseEnter={(e) => {
                    onZoneHover(zone);
                    handleLocationHover(zone.main_area, e);
                  }}
                  onMouseLeave={handleLocationLeave}
                >
                  <ZoneCard
                    zone={zone}
                    index={index}
                    active={activeZoneIndex === index}
                    onClick={() => onZoneClick(index)}
                    onHover={onZoneHover}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${colors.border}`,
        background: colors.surface2,
        fontSize: '11px',
        color: colors.text.muted,
        display: 'flex',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <span>{language === 'bn' ? `মোট ঘটনা: ${zones.length}` : `Total events: ${zones.length}`}</span>
        <span>{language === 'bn' ? `মোট মামলা: ${zones.reduce((sum, z) => sum + z.quantity, 0)}` : `Total cases: ${zones.reduce((sum, z) => sum + z.quantity, 0)}`}</span>
        <span>⚡ {language === 'bn' ? `ঝুঁকিপূর্ণ: ${zones.filter(z => (z.totalLocationQuantity || z.quantity) >= 20).length}` : `High risk: ${zones.filter(z => (z.totalLocationQuantity || z.quantity) >= 20).length}`}</span>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;