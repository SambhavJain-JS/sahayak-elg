import { useEffect, useRef } from "react";

/**
 * AudioPlayer — plays an MP3 file, falls back to browser TTS.
 * Shows a replay button the user can tap to hear again.
 */
export default function AudioPlayer({ audioFile, ttsFallback, autoPlay = true }) {
  const audioRef = useRef(null);
  const isPlaying = useRef(false);

  useEffect(() => {
    if (autoPlay) playAudio();
    return () => stopAll();
  }, [audioFile]);

  function playAudio() {
    stopAll();

    if (audioFile) {
      const audio = new Audio(audioFile);
      audioRef.current = audio;
      audio.play().catch(() => {
        // File not found — use TTS fallback
        speakHindi(ttsFallback);
      });
    } else {
      speakHindi(ttsFallback);
    }
    isPlaying.current = true;
  }

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    isPlaying.current = false;
  }

  function speakHindi(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  }

  return (
    <button className="audio-btn" onClick={playAudio} title="ऑडियो दोबारा सुनें">
      🔊 <span>दोबारा सुनें</span>
    </button>
  );
}
