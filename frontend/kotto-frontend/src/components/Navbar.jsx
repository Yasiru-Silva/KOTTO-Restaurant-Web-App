import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";
import logo from "../assets/Logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { openCart, cartItems } = useCart();
  const cartItemCount =
    cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

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
        {/* LEFT — Logo / Home */}
        <div
          className={styles.brand}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="KOTTO Logo" className={styles.logoImage} />
        </div>

        {/* CENTER — Admin navigation */}
        <div className={styles.navCenter}>
          {isAdmin && (
            <>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/orders")}
              >
                Orders
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/reservations")}
              >
                Reservations
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/add-item")}
              >
                Add Item
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/admin/inventory")}
              >
                Inventory
              </button>
            </>
          )}
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

          {/* Logged-in user */}
          {isUser && (
            <>
              <button
                className={styles.navButton}
                onClick={() => navigate("/reservation")}
              >
                Reservation
              </button>
              <button className={styles.navButton} onClick={openCart}>
                Cart {cartItemCount > 0 ? `(${cartItemCount})` : ""}
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
            </>
          )}

          {/* Admin */}
          {isAdmin && (
            <button className={styles.navButton} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;