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
        message_hi: "आपके जवाबों के आधार पर, आप आयुष्मान भारत वय वंदना योजना के लिए पात्र हो सकते हैं। 5 लाख रुपये तक का मुफ़्त इलाज मिलेगा।",
        benefits: ["5 लाख रुपये तक का मुफ़्त इलाज", "29,000+ अस्पतालों में मान्य", "कोई प्रीमियम नहीं — बिल्कुल मुफ़्त", "कैशलेस इलाज"],
      };
    }
    if (age70 && india && !aadhaar) {
      return {
        eligible: false, result: "needs_aadhaar", pathway: "vay_vandana_yojana",
        message_hi: "आप 70 साल से ऊपर हैं और पात्र लग रहे हैं, लेकिन आधार कार्ड ज़रूरी है।",
        next_steps: ["नज़दीकी आधार सेवा केंद्र जाएँ", "uidai.gov.in पर अपॉइंटमेंट लें"],
      };
    }
    if (!age70 && india) {
      return {
        eligible: null, result: "general_pathway", pathway: "pmjay_secc",
        message_hi: "आप 70 साल से कम हैं। पीएम-जेएवाई पात्रता एसईसीसी सूची पर निर्भर करती है। सीएससी केंद्र पर जाँच करें।",
        next_steps: ["pmjay.gov.in पर अपना नाम जाँच करें", "नज़दीकी सीएससी केंद्र जाएँ"],
      };
    }
    return {
      eligible: false, result: "not_eligible", pathway: "none",
      message_hi: "इस योजना का लाभ सिर्फ़ भारत में रहने वाले नागरिकों के लिए है।",
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
