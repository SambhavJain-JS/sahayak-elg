import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";

const FOLLOW_UP_OPTIONS = [
  { emoji: "📝", label: "Registration kaise karein?", type: "registration" },
  { emoji: "📄", label: "Kaun se documents chahiye?", type: "documents" },
  { emoji: "🛡️", label: "Scam se kaise bachein?", type: "safety" },
  { emoji: "🏥", label: "Hospital kahan hai?", type: "hospital" },
];

const INFO_CARDS = {
  registration: {
    emoji: "📝",
    title: "Registration Steps",
    content: [
      "1️⃣ Nazdiki CSC Center ya empanelled hospital jayen",
      "2️⃣ Aadhaar card aur ration card saath le jayen",
      "3️⃣ Ayushman card banwa lein — bilkul MUFT",
      "4️⃣ Official site: pmjay.gov.in",
    ],
  },
  documents: {
    emoji: "📄",
    title: "Zaroori Documents",
    content: [
      "✅ Aadhaar Card (sabse zaroori)",
      "✅ Ration Card (agar ho)",
      "✅ Voter ID ya koi government ID",
      "❌ Koi bhi PAISA mat dena — yeh MUFT hai!",
    ],
  },
  safety: {
    emoji: "🛡️",
    title: "Scam se Bachao",
    content: [
      "❌ Koi bhi paisa mat dena — Ayushman MUFT hai",
      "❌ OTP kisi ko mat batana",
      "❌ Private agent par mat bharosa karna",
      "✅ Helpline: 14555 (FREE call)",
    ],
  },
  hospital: {
    emoji: "🏥",
    title: "Hospital Dhundhein",
    content: [
      "pmjay.gov.in par 'Hospital Locator' kholein",
      "Ya helpline 14555 par call karein",
      "29,000+ hospitals poore India mein",
    ],
  },
};

export default function Result({ result }) {
  const [selectedInfo, setSelectedInfo] = useState(null);

  if (!result) return null;

  const isEligible   = result.eligible === true;
  const needsAadhaar = result.result === "needs_aadhaar";
  const isGeneral    = result.result === "general_pathway";

  const badgeClass = isEligible ? "eligible" : isGeneral ? "partial" : "ineligible";
  const badgeText  = isEligible
    ? "✅ Eligible"
    : isGeneral
    ? "⚠️ Verify Karein"
    : needsAadhaar
    ? "🪪 Aadhaar Chahiye"
    : "❌ Eligible Nahi";

  const heroEmoji = isEligible ? "🎉" : needsAadhaar ? "🪪" : isGeneral ? "ℹ️" : "😔";
  const resultTTS = result.message_hi || "Eligibility check complete ho gaya hai.";

  // Drill-down info card view
  if (selectedInfo) {
    const info = INFO_CARDS[selectedInfo];
    return (
      <div className="card">
        <div className="hero-emoji">{info.emoji}</div>
        <div className="title title--sm">{info.title}</div>

        <div className="stack">
          {info.content.map((line, i) => (
            <div key={i} className="info-line">
              {line}
            </div>
          ))}
        </div>

        <button
          className="btn-ghost"
          onClick={() => setSelectedInfo(null)}
        >
          ← Wapas jayen
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flag-stripe" />

      <div className="hero-emoji">{heroEmoji}</div>

      <span className={`result-badge ${badgeClass}`}>{badgeText}</span>

      <div className="result-message">{result.message_hi}</div>

      <AudioPlayer ttsFallback={resultTTS} autoPlay={true} />

      {/* Benefits list (if eligible) */}
      {isEligible && result.benefits && (
        <div className="stack">
          {result.benefits.map((b, i) => (
            <div key={i} className="benefit-row">
              ✓ {b}
            </div>
          ))}
        </div>
      )}

      {/* Next steps (if not eligible) */}
      {!isEligible && result.next_steps?.length > 0 && (
        <div className="stack">
          {result.next_steps.map((s, i) => (
            <div key={i} className="next-step">
              {i + 1}. {s}
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      <div className="subtitle">
        Aur kya jaanna chahte hain?
      </div>

      <div className="option-grid">
        {FOLLOW_UP_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            className="option-card"
            onClick={() => setSelectedInfo(opt.type)}
          >
            <span className="option-emoji">{opt.emoji}</span>
            <span className="option-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
