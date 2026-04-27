import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cols}>
          {/* Opening Hours */}
          <div className={styles.col}>
            <h3 className={styles.title}>Opening Hours</h3>
            <p className={styles.text}>11:00 AM – 11:00 PM</p>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h3 className={styles.title}>Contact</h3>
            <p className={styles.text}>Phone: +94 (0) 123 456 789</p>
            <p className={styles.text}>Email: KOTTO@gmail.com</p>
          </div>

          {/* Extra links from your branch */}
          <div className={styles.col}>
            <h3 className={styles.title}>Links</h3>
            <span
              className={`${styles.text} ${styles.link}`}
              onClick={() => navigate("/")}
            >
              Menu
            </span>
            <span className={styles.text}>Contact</span>
            <span className={styles.text}>About</span>
          </div>
        </div>

        <div className={styles.bottom}>
          © 2026 KOTTO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}