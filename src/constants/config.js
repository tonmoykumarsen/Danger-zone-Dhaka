// src/constants/config.js
export const BANGLADESH_CENTER = [23.6850, 90.3563];
export const DEFAULT_ZOOM = 7;

export const CRIME_TYPE_FILTERS = [
  "সবগুলো",
  "হত্যা",
  "ধর্ষণ",
  "ডাকাতি",
  "অপহরণ",
  "মাদক",
  "অন্যান্য"
];

export const TIME_PERIODS = [
  { value: "সব সময়", label: "সব সময়", icon: "📅", color: "#60a5fa" },
  { value: "সকাল", label: "সকাল (৬-১২)", icon: "🌅", color: "#f59e0b" },
  { value: "দিন", label: "দিন (১২-৬)", icon: "☀️", color: "#fbbf24" },
  { value: "বিকাল", label: "বিকাল (৬-৯)", icon: "🌆", color: "#f97316" },
  { value: "রাত", label: "রাত (৯-৬)", icon: "🌙", color: "#3b82f6" },
  { value: "অজানা", label: "অজানা", icon: "❓", color: "#6b7280" }
];

export const TYPE_CONFIG = {
  "হত্যা": {
    badge: "Killed",
    color: "#ff2d2d",
    icon: "🔪",
    description: "Murder"
  },
  // "খুন": {
  //   badge: "HOMICIDE",
  //   color: "#ff2d2d",
  //   icon: "🔪",
  //   description: "Murder / Homicide"
  // },
  "ধর্ষণ": {
    badge: "RAPE",
    color: "#ff6b1a",
    icon: "⚠️",
    description: "Rape / Sexual Assault"
  },
  "ডাকাতি": {
    badge: "ROBBERY",
    color: "#ff4500",
    icon: "💰",
    description: "Robbery / Theft"
  },
  "অপহরণ": {
    badge: "KIDNAPPING",
    color: "#f0a500",
    icon: "⛓️",
    description: "Kidnapping / Abduction"
  },
  "মাদক": {
    badge: "DRUGS",
    color: "#22c55e",
    icon: "💊",
    description: "Drugs / Narcotics"
  },
  "অন্যান্য": {
    badge: "OTHER",
    color: "#6b7280",
    icon: "📌",
    description: "Other Crimes"
  }
};

export const RISK_LEVELS = {
  critical: {
    threshold: 50,
    label: "সবচেয়ে ঝুঁকিপূর্ণ",
    color: "#ff2d2d",
    emoji: "🔥",
    en: "Critical"
  },
  high: {
    threshold: 20,
    label: "উচ্চ ঝুঁকি",
    color: "#ff6b1a",
    emoji: "⚠️",
    en: "High Risk"
  },
  medium: {
    threshold: 10,
    label: "মাঝারি ঝুঁকি",
    color: "#f0a500",
    emoji: "⚡",
    en: "Medium Risk"
  },
  low: {
    threshold: 5,
    label: "নিম্ন ঝুঁকি",
    color: "#22c55e",
    emoji: "✅",
    en: "Low Risk"
  },
  normal: {
    threshold: 0,
    label: "স্বাভাবিক",
    color: "#3b82f6",
    emoji: "ℹ️",
    en: "Normal"
  }
};