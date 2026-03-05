import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">
        <h1>Welcome to KOTTO</h1>
        <p>Experience the best Sri Lankan street food</p>

        <button
          onClick={() =>
            document
              .getElementById("menu-section")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          View Menu
        </button>
      </div>

    </section>
  );
}

export default Hero;