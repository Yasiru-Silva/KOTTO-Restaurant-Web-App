import Hero from "../components/Hero";
import MenuList from "../components/MenuList";
import "../styles/MenuPage.css";

function MenuPage() {

  return (
    <div className="menu-page">

      <Hero />

      {/* Best Deals */}
      <section className="best-deals">
        <h2>🔥 Our Best Deals</h2>
        <p>Special combo meals coming soon</p>
      </section>

      {/* Menu Section */}
      <section id="menu-section">

        <h2 className="menu-title">🍜 Our Menu</h2>

        <MenuList />

      </section>

    </div>
  );
}

export default MenuPage;