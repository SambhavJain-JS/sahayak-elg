import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";

const FOLLOW_UP_OPTIONS = [
  { emoji: "📝", label: "पंजीकरण कैसे करें?", type: "registration" },
  { emoji: "📄", label: "कौन से दस्तावेज़ चाहिए?", type: "documents" },
  { emoji: "🛡️", label: "धोखाधड़ी से कैसे बचें?", type: "safety" },
  { emoji: "🏥", label: "अस्पताल कहाँ है?", type: "hospital" },
];

const INFO_CARDS = {
  registration: {
    emoji: "📝",
    title: "पंजीकरण के चरण",
    content: [
      "1️⃣ नज़दीकी सीएससी केंद्र या सूचीबद्ध अस्पताल जाएँ",
      "2️⃣ आधार कार्ड और राशन कार्ड साथ ले जाएँ",
      "3️⃣ आयुष्मान कार्ड बनवा लें — बिल्कुल मुफ़्त",
      "4️⃣ आधिकारिक वेबसाइट: pmjay.gov.in",
    ],
  },
  documents: {
    emoji: "📄",
    title: "ज़रूरी दस्तावेज़",
    content: [
      "✅ आधार कार्ड (सबसे ज़रूरी)",
      "✅ राशन कार्ड (अगर हो)",
      "✅ वोटर पहचान पत्र या कोई सरकारी पहचान पत्र",
      "❌ कोई भी पैसा मत देना — यह मुफ़्त है!",
    ],
  },
  safety: {
    emoji: "🛡️",
    title: "धोखाधड़ी से बचाव",
    content: [
      "❌ कोई भी पैसा मत देना — आयुष्मान मुफ़्त है",
      "❌ ओटीपी किसी को मत बताना",
      "❌ निजी एजेंट पर भरोसा न करें",
      "✅ हेल्पलाइन: 14555 (मुफ़्त कॉल)",
    ],
  },
  hospital: {
    emoji: "🏥",
    title: "अस्पताल खोजें",
    content: [
      "pmjay.gov.in पर 'अस्पताल खोजें' खोलें",
      "या हेल्पलाइन 14555 पर कॉल करें",
      "29,000+ अस्पताल पूरे भारत में",
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
    ? "✅ पात्र"
    : isGeneral
    ? "⚠️ जाँच करें"
    : needsAadhaar
    ? "🪪 आधार चाहिए"
    : "❌ पात्र नहीं";

  const heroEmoji = isEligible ? "🎉" : needsAadhaar ? "🪪" : isGeneral ? "ℹ️" : "😔";
  const resultTTS = result.message_hi || "पात्रता जाँच पूरी हो गई है।";

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
          ← वापस जाएँ
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
        और क्या जानना चाहते हैं?
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
