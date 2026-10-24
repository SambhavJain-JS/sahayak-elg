/**
 * Ayushman Saathi — Question Data (Hindi)
 * Data-driven question tree for PM-JAY eligibility check.
 * Change questions here without touching React components.
 */

export const questions = [
  {
    id: "age_70_plus",
    emoji: "👴",
    textHi: "क्या आपकी उम्र 70 साल या उससे ज़्यादा है?",
    audioFile: "/audio/q1_age.mp3",
    // fallback TTS text if audio file not found
    ttsFallback: "क्या आपकी उम्र 70 साल या उससे ज़्यादा है?",
  },
  {
    id: "resident_india",
    emoji: "🇮🇳",
    textHi: "क्या आप भारत में रहते हैं?",
    audioFile: "/audio/q2_resident.mp3",
    ttsFallback: "क्या आप भारत में रहते हैं?",
  },
  {
    id: "has_aadhaar",
    emoji: "🪪",
    textHi: "क्या आपके पास आधार कार्ड है?",
    audioFile: "/audio/q3_aadhaar.mp3",
    ttsFallback: "क्या आपके पास आधार कार्ड है?",
  },
  {
    id: "existing_scheme",
    emoji: "🏥",
    textHi: "क्या आप पहले से किसी सरकारी बीमा योजना में शामिल हैं?",
    audioFile: "/audio/q4_existing.mp3",
    ttsFallback: "क्या आप पहले से किसी सरकारी बीमा योजना में शामिल हैं?",
  },
];

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
