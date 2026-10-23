import AudioPlayer from "../components/AudioPlayer";

export default function Welcome({ onStart }) {
  const welcomeText =
    "Namaste. Hum aapko Ayushman Bharat yojana ke baare mein batayenge aur check karenge ki kya aap eligible hain. Shuru karne ke liye button dabayein.";

  return (
    <div className="card">
      <div className="flag-stripe" />

      <div className="hero-emoji">🏥</div>

      <div className="title">Ayushman Saathi</div>

      <div className="subtitle">
        Ayushman Bharat yojana mein aapki eligibility janiye
        <br />
        — bilkul muft, seedha aapke phone par
      </div>

      <AudioPlayer ttsFallback={welcomeText} autoPlay={true} />

      <div className="divider" />

      <button className="btn-start" onClick={onStart}>
        ▶ &nbsp; Shuru Karein
      </button>

      <div className="subtitle" style={{ fontSize: "11px", opacity: 0.5 }}>
        🔒 Koi data save nahi hoga • Bilkul muft
      </div>
    </div>
  );
}
