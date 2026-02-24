import { TYPE_CONFIG, RISK_LEVELS, TIME_PERIODS } from "../constants/config";

export const getTypeConfig = (crimeType) => {
  if (TYPE_CONFIG[crimeType]) {
    return TYPE_CONFIG[crimeType];
  }
  
  const normalizedType = Object.keys(TYPE_CONFIG).find(
    key => key.toLowerCase() === crimeType?.toLowerCase()
  );
  
  return TYPE_CONFIG[normalizedType] || TYPE_CONFIG["অন্যান্য"];
};

export const getRiskLevel = (quantity) => {
  const riskLevels = Object.values(RISK_LEVELS).sort((a, b) => b.threshold - a.threshold);
  
  for (const risk of riskLevels) {
    if (quantity >= risk.threshold) {
      return {
        label: risk.label,
        color: risk.color,
        emoji: risk.emoji,
        threshold: risk.threshold
      };
    }
  }
  
  return {
    label: "স্বাভাবিক",
    color: "#3b82f6",
    emoji: "ℹ️",
    threshold: 0
  };
};

export const calculateMarkerSize = (quantity) => {
  return Math.max(24, 18 + Math.sqrt(quantity) * 4);
};

export const parseBengaliDate = (bengaliDate) => {
  if (!bengaliDate) return null;
  
  try {
    const parts = bengaliDate.split(' ');
    if (parts.length === 3) {
      const day = parseInt(convertBengaliToEnglish(parts[0]));
      const month = getMonthNumber(parts[1]);
      const year = parseInt(convertBengaliToEnglish(parts[2]));
      
      if (month !== -1 && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  } catch (error) {
    console.error("Error parsing date:", error);
  }
  
  return null;
};

export const getMonthNumber = (bengaliMonth) => {
  const monthMap = {
    "জানুয়ারি": 0,
    "ফেব্রুয়ারি": 1,
    "মার্চ": 2,
    "এপ্রিল": 3,
    "মে": 4,
    "জুন": 5,
    "জুলাই": 6,
    "আগস্ট": 7,
    "সেপ্টেম্বর": 8,
    "অক্টোবর": 9,
    "নভেম্বর": 10,
    "ডিসেম্বর": 11
  };
  
  return monthMap[bengaliMonth] !== undefined ? monthMap[bengaliMonth] : -1;
};

export const applyCrimeTypeFilter = (zones, crimeTypeFilter) => {
  if (crimeTypeFilter === "সবগুলো") return zones;
  return zones.filter(zone => zone["Crime Type"] === crimeTypeFilter);
};

export const applyTimePeriodFilter = (zones, timePeriodFilter) => {
  if (timePeriodFilter === "সব সময়") return zones;
  return zones.filter(zone => zone["Crime period"] === timePeriodFilter);
};

export const applySearchFilter = (zones, search) => {
  const searchLower = search.toLowerCase().trim();
  if (!searchLower) return zones;
  
  return zones.filter(zone => 
    zone["Crime Location"].toLowerCase().includes(searchLower) ||
    zone["Crime Type"].toLowerCase().includes(searchLower)
  );
};

export const filterZones = (zones, crimeTypeFilter, timePeriodFilter, search) => {
  let filtered = zones;
  filtered = applyCrimeTypeFilter(filtered, crimeTypeFilter);
  filtered = applyTimePeriodFilter(filtered, timePeriodFilter);
  filtered = applySearchFilter(filtered, search);
  return filtered;
};

// FIXED: This function now works with enhancedZones (not raw data)
export const getStatistics = (zones) => {
  // If no zones, return default values
  if (!zones || zones.length === 0) {
    return {
      total: 0,
      murders: 0,
      rape: 0,
      robbery: 0,
      kidnapping: 0,
      drugs: 0,
      others: 0,
      totalCases: 0,
      maxQuantity: 0,
      hotspot: null,
      riskCounts: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        normal: 0
      }
    };
  }

  // Count unique locations (using main_area from enhancedZones)
  const uniqueLocations = new Set(zones.map(z => z.main_area)).size;
  
  // Initialize counters
  let murders = 0;
  let rape = 0;
  let robbery = 0;
  let kidnapping = 0;
  let drugs = 0;
  let others = 0;
  
  // Track totals
  let totalCases = 0;
  let maxQuantity = 0;
  let hotspot = null;
  
  zones.forEach(zone => {
    // Use enhancedZone properties, not raw data keys
    const type = zone.type;
    const quantity = Number(zone.quantity) || 0;
    
    // Add to total cases
    totalCases += quantity;
    
    // Track max quantity for hotspot
    if (quantity > maxQuantity) {
      maxQuantity = quantity;
      hotspot = zone;
    }
    
    // Count by crime type
    if (type === "হত্যা" || type === "খুন") {
      murders++;
    } else if (type === "ধর্ষণ") {
      rape++;
    } else if (type === "ডাকাতি") {
      robbery++;
    } else if (type === "অপহরণ") {
      kidnapping++;
    } else if (type === "মাদক") {
      drugs++;
    } else {
      others++;
    }
  });

  // Calculate risk level counts (using quantity from enhancedZones)
  const riskCounts = {
    critical: zones.filter(z => z.quantity >= 50).length,
    high: zones.filter(z => z.quantity >= 20 && z.quantity < 50).length,
    medium: zones.filter(z => z.quantity >= 10 && z.quantity < 20).length,
    low: zones.filter(z => z.quantity >= 5 && z.quantity < 10).length,
    normal: zones.filter(z => z.quantity < 5).length
  };

  const stats = {
    total: uniqueLocations,
    murders: murders,
    rape: rape,
    robbery: robbery,
    kidnapping: kidnapping,
    drugs: drugs,
    others: others,
    totalCases: totalCases,
    maxQuantity: maxQuantity,
    hotspot: hotspot,
    riskCounts: riskCounts
  };

  return stats;
};

export const getTimePeriodStatistics = (zones) => {
  const timeStats = {};
  
  TIME_PERIODS.forEach(period => {
    timeStats[period.value] = {
      count: 0,
      totalCases: 0,
      crimes: {}
    };
  });
  
  zones.forEach(zone => {
    const period = zone["Crime period"] || "অজানা";
    if (timeStats[period]) {
      timeStats[period].count++;
      timeStats[period].totalCases += zone["Crime quantity"] || 0;
      
      const type = zone["Crime Type"];
      if (!timeStats[period].crimes[type]) {
        timeStats[period].crimes[type] = {
          count: 0,
          quantity: 0,
          color: getTypeConfig(type).color
        };
      }
      timeStats[period].crimes[type].count++;
      timeStats[period].crimes[type].quantity += zone["Crime quantity"] || 0;
    }
  });
  
  return timeStats;
};

export const formatBengaliDate = (bengaliDate) => {
  if (!bengaliDate) return "Unknown";
  
  const parts = bengaliDate.split(' ');
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    const englishDay = convertBengaliToEnglish(day);
    const englishYear = convertBengaliToEnglish(year);
    
    return `${englishDay} ${month} ${englishYear}`;
  }
  
  return bengaliDate;
};

const convertBengaliToEnglish = (bengaliNum) => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let englishNum = bengaliNum;
  bengaliDigits.forEach((digit, index) => {
    englishNum = englishNum.replace(new RegExp(digit, 'g'), englishDigits[index]);
  });
  
  return englishNum;
};

export const enhanceZones = (zones) => {
  return zones.map(zone => {
    const date = parseBengaliDate(zone["Crime date"]);
    const risk = getRiskLevel(zone["Crime quantity"]);
    
    return {
      id: `${zone["Crime Location"]}-${zone["Crime Type"]}-${zone["Crime date"]}-${zone["Crime period"]}`,
      main_area: zone["Crime Location"],
      sub_area: zone["Crime Location"],
      type: zone["Crime Type"],
      quantity: zone["Crime quantity"],
      location: [zone.latitude, zone.longitude],
      date: zone["Crime date"],
      dateObj: date,
      period: zone["Crime period"] || "অজানা",
      confidence: zone.confidence,
      typeConfig: getTypeConfig(zone["Crime Type"]),
      risk: risk,
      riskLevel: risk.label,
      riskColor: risk.color,
      riskEmoji: risk.emoji
    };
  });
};

export const getUniqueLocations = (zones) => {
  const locations = new Set();
  zones.forEach(zone => locations.add(zone["Crime Location"]));
  return Array.from(locations).sort();
};

export const getCrimeTypeBreakdown = (zones) => {
  const breakdown = {};
  zones.forEach(zone => {
    const type = zone["Crime Type"];
    if (!breakdown[type]) {
      breakdown[type] = {
        count: 0,
        totalQuantity: 0,
        locations: new Set()
      };
    }
    breakdown[type].count++;
    breakdown[type].totalQuantity += zone["Crime quantity"];
    breakdown[type].locations.add(zone["Crime Location"]);
  });
  
  Object.keys(breakdown).forEach(key => {
    breakdown[key].locations = Array.from(breakdown[key].locations);
  });
  
  return breakdown;
};