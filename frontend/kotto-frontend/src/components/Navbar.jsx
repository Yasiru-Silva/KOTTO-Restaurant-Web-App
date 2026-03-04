import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">K</div>
          <span className={styles.brandText}>KOTTO</span>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
