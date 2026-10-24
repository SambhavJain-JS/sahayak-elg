import AudioPlayer from "../components/AudioPlayer";

export default function Welcome({ onStart }) {
  const welcomeText =
    "नमस्ते। हम आपको आयुष्मान भारत योजना के बारे में बताएँगे और जाँच करेंगे कि क्या आप पात्र हैं। शुरू करने के लिए बटन दबाएँ।";

  return (
    <div className="card">
      {/* Middle: branding — vertically centered */}
      <div className="card-body">
        <div className="flag-stripe" />
        <div className="hero-emoji">🏥</div>
        <div className="title">आयुष्मान साथी</div>
        <div className="subtitle">
          आयुष्मान भारत योजना में अपनी पात्रता जानिए
          <br />
          — बिल्कुल मुफ़्त, सीधे आपके फ़ोन पर
        </div>
        <AudioPlayer ttsFallback={welcomeText} autoPlay={true} />
      </div>

      {/* Bottom actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <button className="btn-start" onClick={onStart}>
          ▶ &nbsp; शुरू करें
        </button>
        <div className="fine-print">
          🔒 कोई जानकारी नहीं रखी जाएगी • बिल्कुल मुफ़्त
        </div>
      </div>
    </div>
  );
}
