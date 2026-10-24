import { useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";

export default function Question({ question, questionIndex, total, onAnswer }) {
  const percent = ((questionIndex) / total) * 100;

  // Auto-read question via TTS when it loads
  useEffect(() => {
    window.speechSynthesis?.cancel();
  }, [question]);

  return (
    <div className="card">
      {/* Progress */}
      <div className="progress-wrap">
        <div className="progress-label">
          Sawaal {questionIndex + 1} / {total}
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question emoji/image */}
      <div className="hero-emoji hero-emoji--md">
        {question.emoji}
      </div>

      {/* Question text */}
      <div className="question-text">{question.textHi}</div>

      {/* Audio replay */}
      <AudioPlayer
        audioFile={question.audioFile}
        ttsFallback={question.ttsFallback}
        autoPlay={true}
      />

      <div className="divider" />

      {/* YES / NO buttons */}
      <div className="yes-no-row">
        <button className="btn-yes" onClick={() => onAnswer("yes")}>
          <span className="thumb">👍</span>
          <span className="btn-label">Haan</span>
        </button>
        <button className="btn-no" onClick={() => onAnswer("no")}>
          <span className="thumb">👎</span>
          <span className="btn-label">Nahi</span>
        </button>
      </div>
    </div>
  );
}
