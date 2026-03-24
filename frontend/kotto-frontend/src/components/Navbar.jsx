import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { openCart } = useCart();

  console.log("USER:", user);
  console.log("ROLE:", user?.role);

  const role = user?.role;

  const isUser = role === "USER" || role === "ROLE_USER";
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  return (
    <header className={styles.header}>
      <nav className={styles.inner}>

        {/* LEFT */}
        <div className={styles.nav}>
          {isAdmin ? (
            <>
              <button className={styles.navButton}>Inventory</button>
              <button className={styles.navButton}>Reservations</button>
            </>
          ) : (
            <button className={styles.navButton} onClick={() => navigate("/reservation")}>Reservation</button>
          )}
        </div>

        {/* CENTER */}
        <div className={styles.brand} style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <div className={styles.logo}>K</div>
          <span className={styles.brandText}>KOTTO</span>
        </div>

        {/* RIGHT */}
        <div className={styles.nav}>
          {!user && (
            <>
              <button className={styles.navButton} onClick={openCart}>Cart</button>
              <button className={styles.navButton} onClick={() => navigate("/login")}>Login</button>
            </>
          )}

          {isUser && (
            <>
              <button className={styles.navButton} onClick={openCart}>Cart</button>
              <button className={styles.navButton}>Profile</button>
            </>
          )}

          {isAdmin && (
            <>
              <button className={styles.navButton}>Add Item</button>
              <button className={styles.navButton}>Orders</button>
              <button className={styles.navButton} onClick={logout}>Logout</button>
            </>
          )}
        </div>

      </nav>
    </header>
  );
};

export default Navbar;