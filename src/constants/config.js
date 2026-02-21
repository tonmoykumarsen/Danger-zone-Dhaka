export const TYPE_CONFIG = {
  "হত্যা": { 
    color: "#ff2d2d", 
    icon: "💀", 
    badge: "হত্যা",
    gradient: "from-red-600 to-red-800",
    description: "Murder/Homicide"
  },
  "খুন": { 
    color: "#ff2d2d", 
    icon: "💀", 
    badge: "খুন",
    gradient: "from-red-600 to-red-800",
    description: "Murder"
  },
  "ধর্ষণ": { 
    color: "#ff6b1a", 
    icon: "⚡", 
    badge: "ধর্ষণ",
    gradient: "from-orange-500 to-orange-700",
    description: "Rape"
  },
  "ডাকাতি": { 
    color: "#ff4500", 
    icon: "🔫", 
    badge: "ডাকাতি",
    gradient: "from-orange-600 to-red-600",
    description: "Robbery/Dacoity"
  },
  "অপহরণ": { 
    color: "#f0a500", 
    icon: "🔶", 
    badge: "অপহরণ",
    gradient: "from-yellow-500 to-yellow-700",
    description: "Kidnapping"
  },
  "মাদক": { 
    color: "#22c55e", 
    icon: "💊", 
    badge: "মাদক",
    gradient: "from-green-500 to-green-700",
    description: "Drugs/Narcotics"
  },
  "নির্যাতন": { 
    color: "#a855f7", 
    icon: "⚡", 
    badge: "নির্যাতন",
    gradient: "from-purple-500 to-purple-700",
    description: "Torture"
  },
  "অগ্নিসংযোগ": { 
    color: "#ef4444", 
    icon: "🔥", 
    badge: "অগ্নিসংযোগ",
    gradient: "from-red-500 to-red-700",
    description: "Arson"
  },
  "চুরি": { 
    color: "#64748b", 
    icon: "💰", 
    badge: "চুরি",
    gradient: "from-slate-500 to-slate-700",
    description: "Theft"
  },
  "অন্যান্য": { 
    color: "#6b7280", 
    icon: "●", 
    badge: "অন্যান্য",
    gradient: "from-gray-500 to-gray-700",
    description: "Others"
  },
};

export const BENGALI_MONTHS = {
  "জানুয়ারি": "January",
  "ফেব্রুয়ারি": "February",
  "মার্চ": "March",
  "এপ্রিল": "April",
  "মে": "May",
  "জুন": "June",
  "জুলাই": "July",
  "আগস্ট": "August",
  "সেপ্টেম্বর": "September",
  "অক্টোবর": "October",
  "নভেম্বর": "November",
  "ডিসেম্বর": "December"
};

export const FILTER_OPTIONS = ["সবগুলো", "হত্যা", "খুন", "ধর্ষণ", "ডাকাতি", "অপহরণ", "মাদক", "অন্যান্য"];

export const BANGLADESH_CENTER = [23.6850, 90.3563];
export const DEFAULT_ZOOM = 7;

export const RISK_THRESHOLDS = [
  { min: 50, label: "সবচেয়ে ঝুঁকিপূর্ণ", color: "#ff2d2d", emoji: "🔥" },
  { min: 20, label: "উচ্চ ঝুঁকি", color: "#ff6b1a", emoji: "⚠️" },
  { min: 10, label: "মাঝারি ঝুঁকি", color: "#f0a500", emoji: "⚡" },
  { min: 5, label: "নিম্ন ঝুঁকি", color: "#22c55e", emoji: "✅" },
  { min: 0, label: "স্বাভাবিক", color: "#3b82f6", emoji: "ℹ️" },
];

// export const MAP_TILES = {
//   street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//   satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//   dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
// };
export const MAP_TILES = {
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  dark: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // ✅ replaced
};
export const STATS_CONFIG = {
  totalCases: { label: "মোট ঘটনা", color: "#60a5fa" },
  murders: { label: "হত্যা", color: "#ff2d2d" },
  rape: { label: "ধর্ষণ", color: "#ff6b1a" },
  robbery: { label: "ডাকাতি", color: "#ff4500" },
  kidnapping: { label: "অপহরণ", color: "#f0a500" },
  drugs: { label: "মাদক", color: "#22c55e" },
  others: { label: "অন্যান্য", color: "#6b7280" }
};