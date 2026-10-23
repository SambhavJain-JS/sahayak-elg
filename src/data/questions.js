/**
 * Ayushman Saathi — Question Data (Hindi)
 * Data-driven question tree for PM-JAY eligibility check.
 * Change questions here without touching React components.
 */

export const questions = [
  {
    id: "age_70_plus",
    emoji: "👴",
    textHi: "Kya aapki umar 70 saal ya usse zyada hai?",
    audioFile: "/audio/q1_age.mp3",
    // fallback TTS text if audio file not found
    ttsFallback: "Kya aapki umar 70 saal ya usse zyada hai?",
  },
  {
    id: "resident_india",
    emoji: "🇮🇳",
    textHi: "Kya aap India mein rehte hain?",
    audioFile: "/audio/q2_resident.mp3",
    ttsFallback: "Kya aap India mein rehte hain?",
  },
  {
    id: "has_aadhaar",
    emoji: "🪪",
    textHi: "Kya aapke paas Aadhaar card hai?",
    audioFile: "/audio/q3_aadhaar.mp3",
    ttsFallback: "Kya aapke paas Aadhaar card hai?",
  },
  {
    id: "existing_scheme",
    emoji: "🏥",
    textHi: "Kya aap pehle se kisi sarkari bima yojana mein shamil hain?",
    audioFile: "/audio/q4_existing.mp3",
    ttsFallback: "Kya aap pehle se kisi sarkari bima yojana mein shamil hain?",
  },
];

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
