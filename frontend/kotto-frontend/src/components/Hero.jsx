import mascot from "../assets/kotto_mascot.png";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-card">
        {/* Left — text */}
        <div className="hero-text">
          <span className="hero-eyebrow">WELCOME TO KOTTO</span>
          <h1 className="hero-heading">
            Order Based on<br />
            Your <span className="hero-accent">Mood</span>
          </h1>
          <p className="hero-sub">
            Not sure what you want? Let how you feel
            dictate what you eat today.
          </p>
        </div>

        {/* Right — mascot */}
        <div className="hero-mascot-wrap">
          <img src={mascot} alt="KOTTO mascot" className="hero-mascot" />
        </div>
      </div>
    </section>
  );
}

export default Hero;