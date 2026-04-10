import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { openCart, cartItems } = useCart();
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const role = user?.role;
  const isUser = role === "USER" || role === "ROLE_USER";
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <nav className={styles.inner}>
        <div className={styles.nav}>
          {isAdmin ? (
            <>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/inventory")}
              >
                Inventory
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/reservations")}
              >
                Reservations
              </button>
            </>
          ) : (
            <button
              className={styles.navButton}
              onClick={() => navigate("/reservation")}
            >
              Reservation
            </button>
          )}
        </div>

        <div
          className={styles.brand}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <div className={styles.logo}>K</div>
          <span className={styles.brandText}>KOTTO</span>
        </div>

        <div className={styles.nav}>
          {!user && (
            <>
              <button className={styles.navButton} onClick={openCart}>
                Cart {cartItemCount > 0 ? `(${cartItemCount})` : ""}
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          )}

          {isUser && (
            <>
              <button className={styles.navButton} onClick={openCart}>
                Cart {cartItemCount > 0 ? `(${cartItemCount})` : ""}
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button className={styles.navButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/inventory")}
              >
                Manage Stock
                onClick={() => navigate("/admin/add-item")}
              >
                Add Item
              </button>
              <button className={styles.navButton}>Orders</button>
              <button className={styles.navButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;