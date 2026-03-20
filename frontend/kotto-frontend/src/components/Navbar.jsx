import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>

      {/* LEFT */}
      <div>
        {isAdmin ? (
          <>
            <button>Inventory</button>
            <button>Reservations</button>
          </>
        ) : (
          <button onClick={() => navigate("/reservation")}>Reservation</button>
        )}
      </div>

      {/* CENTER */}
      <div>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>KOTTO</h2>
      </div>

      {/* RIGHT */}
      <div>
        {!user && (
          <>
            <button onClick={openCart}>Cart</button>
            <button onClick={() => navigate("/login")}>Login</button>
          </>
        )}

        {isUser && (
          <>
            <button onClick={openCart}>Cart</button>
            <button>Profile</button>
          </>
        )}

        {isAdmin && (
          <>
            <button>Add Item</button>
            <button>Orders</button>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

    </nav>
  );
};

export default Navbar;