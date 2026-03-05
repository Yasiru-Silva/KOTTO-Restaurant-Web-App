import { useCart } from "./context/CartContext";

export default function Navbar() {
  const { openCart, cartItems } = useCart();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      <h2>My Shop</h2>
      <button onClick={openCart}>
        🛒 ({cartItems.length})
      </button>
    </nav>
  );
}