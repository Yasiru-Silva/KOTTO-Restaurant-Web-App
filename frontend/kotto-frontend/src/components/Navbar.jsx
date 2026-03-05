import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const scrollMenu = () => {
    const section = document.getElementById("menu-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand / Logo */}
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">K</div>
          <span className={styles.brandText}>KOTTO</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>

          {/* Scroll to Menu */}
          <button className={styles.navButton} onClick={scrollMenu}>
            Menu
          </button>

          {/* Cart button */}
          <button className={styles.navButton}>Cart</button>
        </nav>
      </div>
    </header>
  );
}