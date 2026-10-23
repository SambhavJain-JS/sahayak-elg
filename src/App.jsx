import { useState, useRef, useEffect } from "react";
import { questions, BACKEND_URL } from "./data/questions";
import Welcome from "./pages/Welcome";
import Question from "./pages/Question";
import Processing from "./pages/Processing";
import Result from "./pages/Result";
import "./index.css";

// Read session ID from URL param (?session=XYZ) — set by WhatsApp bot
function getSessionFromURL() {
  return new URLSearchParams(window.location.search).get("session");
}

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | question | processing | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(getSessionFromURL());

  // Create backend session if not already provided via URL
  async function initSession() {
    if (sessionId) return sessionId;
    try {
      const res = await fetch(`${BACKEND_URL}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: null }),
      });
      const data = await res.json();
      setSessionId(data.session_id);
      return data.session_id;
    } catch {
      // Backend not running — use local session
      const localId = `LOCAL_${Date.now()}`;
      setSessionId(localId);
      return localId;
    }
  }

  async function handleStart() {
    await initSession();
    setScreen("question");
  }

  async function handleAnswer(answer) {
    const question = questions[currentQ];
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    // Save to backend (fire-and-forget)
    if (sessionId) {
      fetch(`${BACKEND_URL}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: question.id,
          answer,
        }),
      }).catch(() => {});
    }

    const isLast = currentQ === questions.length - 1;

    if (isLast) {
      setScreen("processing");
      await calculateResult(newAnswers);
    } else {
      setCurrentQ((q) => q + 1);
    }
  }

  async function calculateResult(finalAnswers) {
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 2200));

    try {
      if (sessionId) {
        const res = await fetch(`${BACKEND_URL}/eligibility`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();
        setResult(data);
      } else {
        // Offline fallback — run local rule
        setResult(localEligibilityCheck(finalAnswers));
      }
    } catch {
      setResult(localEligibilityCheck(finalAnswers));
    }

    setScreen("result");
  }

  // Local rule engine (mirrors backend eligibility.py)
  function localEligibilityCheck(ans) {
    const age70  = ans.age_70_plus === "yes";
    const india  = ans.resident_india === "yes";
    const aadhaar = ans.has_aadhaar === "yes";
    const existing = ans.existing_scheme === "yes";

    if (age70 && india && aadhaar) {
      return {
        eligible: true, result: "eligible", pathway: "vay_vandana_yojana",
        top_up: existing,
        message_hi: "Aapke jawaabon ke aadhar par, aap Ayushman Bharat Vay Vandana Yojana ke liye eligible ho sakte hain. 5 lakh rupaye tak ka muft ilaaj milega.",
        benefits: ["5 lakh rupaye tak ka muft ilaaj", "29,000+ hospitals mein valid", "Koi premium nahi — bilkul muft", "Cashless treatment"],
      };
    }
    if (age70 && india && !aadhaar) {
      return {
        eligible: false, result: "needs_aadhaar", pathway: "vay_vandana_yojana",
        message_hi: "Aap 70 saal se upar hain aur eligible lag rahe hain, lekin Aadhaar card zaroori hai.",
        next_steps: ["Nazdiki Aadhaar seva kendra jayen", "uidai.gov.in par appointment len"],
      };
    }
    if (!age70 && india) {
      return {
        eligible: null, result: "general_pathway", pathway: "pmjay_secc",
        message_hi: "Aap 70 saal se kam hain. PM-JAY eligibility SECC list par depend karti hai. CSC center par check karein.",
        next_steps: ["pmjay.gov.in par apna naam check karein", "Nazdiki CSC center jayen"],
      };
    }
    return {
      eligible: false, result: "not_eligible", pathway: "none",
      message_hi: "Is yojana ka labh sirf India mein rehne wale nagrikon ke liye hai.",
      next_steps: [],
    };
  }

  return (
    <div className="app-shell">
      {screen === "welcome" && <Welcome onStart={handleStart} />}
      {screen === "question" && (
        <Question
          question={questions[currentQ]}
          questionIndex={currentQ}
          total={questions.length}
          onAnswer={handleAnswer}
        />
      )}
      {screen === "processing" && <Processing />}
      {screen === "result" && <Result result={result} />}
    </div>
  );
}
