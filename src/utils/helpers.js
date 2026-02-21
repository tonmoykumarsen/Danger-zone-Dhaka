// import { TYPE_CONFIG, RISK_THRESHOLDS, BENGALI_MONTHS } from "../constants/config";

export const getTypeConfig = (crimeType) => {
  // Try exact match first
  if (TYPE_CONFIG[crimeType]) {
    return TYPE_CONFIG[crimeType];
  }
  
  // Try case-insensitive match
  const normalizedType = Object.keys(TYPE_CONFIG).find(
    key => key.toLowerCase() === crimeType?.toLowerCase()
  );
  
  return TYPE_CONFIG[normalizedType] || TYPE_CONFIG["অন্যান্য"];
};

export const getRiskLevel = (quantity) => {
  const risk = RISK_THRESHOLDS.find(r => quantity >= r.min) || RISK_THRESHOLDS[RISK_THRESHOLDS.length - 1];
  return risk;
};

export const calculateMarkerSize = (quantity) => {
  return Math.max(24, 18 + Math.sqrt(quantity) * 4);
};

export const filterZones = (zones, filter, search) => {
  return zones.filter(zone => {
    const matchesFilter = filter === "সবগুলো" || zone["Crime Type"] === filter;
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      zone["Crime Location"].toLowerCase().includes(searchLower) ||
      zone["Crime Type"].toLowerCase().includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });
};

export const getStatistics = (zones) => {
  const stats = {
    total: zones.length,
    murders: zones.filter(z => ["হত্যা", "খুন"].includes(z["Crime Type"])).length,
    rape: zones.filter(z => z["Crime Type"] === "ধর্ষণ").length,
    robbery: zones.filter(z => z["Crime Type"] === "ডাকাতি").length,
    kidnapping: zones.filter(z => z["Crime Type"] === "অপহরণ").length,
    drugs: zones.filter(z => z["Crime Type"] === "মাদক").length,
    others: zones.filter(z => !["হত্যা", "খুন", "ধর্ষণ", "ডাকাতি", "অপহরণ", "মাদক"].includes(z["Crime Type"])).length,
    totalCases: zones.reduce((sum, zone) => sum + (zone["Crime quantity"] || 0), 0),
    maxQuantity: Math.max(...zones.map(z => z["Crime quantity"] || 0), 0),
    hotspot: zones.reduce((max, zone) => (zone["Crime quantity"] || 0) > (max?.quantity || 0) ? zone : max, null)
  };

  return stats;
};

export const formatBengaliDate = (bengaliDate) => {
  if (!bengaliDate) return "Unknown";
  
  // Parse Bengali date (e.g., "৩১ মে ২০২৫")
  const parts = bengaliDate.split(' ');
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    // Convert Bengali numerals to English if needed
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
  return zones.map(zone => ({
    id: `${zone["Crime Location"]}-${zone["Crime Type"]}-${zone["Crime date"]}`,
    main_area: zone["Crime Location"],
    sub_area: zone["Crime Location"],
    type: zone["Crime Type"],
    quantity: zone["Crime quantity"],
    location: [zone.latitude, zone.longitude],
    date: zone["Crime date"],
    confidence: zone.confidence,
    typeConfig: getTypeConfig(zone["Crime Type"]),
    risk: getRiskLevel(zone["Crime quantity"])
  }));
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
  
  // Convert Sets to arrays
  Object.keys(breakdown).forEach(key => {
    breakdown[key].locations = Array.from(breakdown[key].locations);
  });
  
  return breakdown;
};