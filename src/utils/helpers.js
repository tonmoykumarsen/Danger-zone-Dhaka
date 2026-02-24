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
        threshold: risk.threshold,
        en: risk.en
      };
    }
  }
  
  return {
    label: "স্বাভাবিক",
    color: "#3b82f6",
    emoji: "ℹ️",
    threshold: 0,
    en: "Normal"
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

// UPDATED: Risk levels based on TOTAL quantity per location
export const getStatistics = (zones) => {
  console.log("getStatistics received zones:", zones);
  
  if (!zones || zones.length === 0) {
    return {
      total: 0, murders: 0, rape: 0, robbery: 0,
      kidnapping: 0, drugs: 0, others: 0,
      totalCases: 0, maxQuantity: 0, hotspot: null,
      riskCounts: { critical: 0, high: 0, medium: 0, low: 0, normal: 0 }
    };
  }

  // Group total quantity per location
  const locationQuantityMap = {};
  const locationCrimesMap = {}; // Store all crimes per location for hotspot detection
  
  zones.forEach(zone => {
    const loc = zone.main_area;
    const quantity = Number(zone.quantity) || 0;
    
    // Sum quantities per location
    locationQuantityMap[loc] = (locationQuantityMap[loc] || 0) + quantity;
    
    // Store crimes per location
    if (!locationCrimesMap[loc]) {
      locationCrimesMap[loc] = [];
    }
    locationCrimesMap[loc].push(zone);
  });

  console.log("Location quantity map:", locationQuantityMap);

  // Count risk levels based on TOTAL quantity per location
  let critical = 0, high = 0, medium = 0, low = 0, normal = 0;
  
  Object.entries(locationQuantityMap).forEach(([location, totalQty]) => {
    if (totalQty >= 50) {
      critical++;
      console.log(`${location} is CRITICAL with ${totalQty} cases`);
    } else if (totalQty >= 20) {
      high++;
      console.log(`${location} is HIGH with ${totalQty} cases`);
    } else if (totalQty >= 10) {
      medium++;
      console.log(`${location} is MEDIUM with ${totalQty} cases`);
    } else if (totalQty >= 5) {
      low++;
      console.log(`${location} is LOW with ${totalQty} cases`);
    } else {
      normal++;
      console.log(`${location} is NORMAL with ${totalQty} cases`);
    }
  });

  // Count crime types
  let murders = 0, rape = 0, robbery = 0, kidnapping = 0, drugs = 0, others = 0;
  let totalCases = 0;
  let maxQuantity = 0;
  let hotspot = null;

  zones.forEach(zone => {
    const type = zone.type;
    const quantity = Number(zone.quantity) || 0;
    
    totalCases += quantity;

    // Find hotspot (highest individual crime quantity, not location total)
    if (quantity > maxQuantity) {
      maxQuantity = quantity;
      hotspot = zone;
    }

    if (type === "হত্যা" || type === "খুন") murders++;
    else if (type === "ধর্ষণ") rape++;
    else if (type === "ডাকাতি") robbery++;
    else if (type === "অপহরণ") kidnapping++;
    else if (type === "মাদক") drugs++;
    else others++;
  });

  const riskCounts = { critical, high, medium, low, normal };
  console.log("Final risk counts:", riskCounts);

  return {
    total: Object.keys(locationQuantityMap).length, // Unique locations
    murders, rape, robbery, kidnapping, drugs, others,
    totalCases, maxQuantity, hotspot,
    riskCounts
  };
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
  // First, calculate total quantity per location for risk assessment
  const locationTotalMap = {};
  zones.forEach(zone => {
    const loc = zone["Crime Location"];
    locationTotalMap[loc] = (locationTotalMap[loc] || 0) + (zone["Crime quantity"] || 0);
  });

  return zones.map(zone => {
    const date = parseBengaliDate(zone["Crime date"]);
    const location = zone["Crime Location"];
    const totalLocationQuantity = locationTotalMap[location] || zone["Crime quantity"];
    
    // Use TOTAL location quantity for risk level, not individual crime quantity
    const risk = getRiskLevel(totalLocationQuantity);
    
    return {
      id: `${location}-${zone["Crime Type"]}-${zone["Crime date"]}-${zone["Crime period"]}`,
      main_area: location,
      sub_area: location,
      type: zone["Crime Type"],
      quantity: zone["Crime quantity"],
      totalLocationQuantity: totalLocationQuantity, // Add total for reference
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