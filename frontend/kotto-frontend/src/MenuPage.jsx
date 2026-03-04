import { useCart } from "./context/CartContext";

export default function MenuPage() {
  const { addToCart } = useCart();

  const items = [
    { id: 1, name: "Burger", price: 1500 },
    { id: 2, name: "Pizza", price: 2500 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: "20px" }}>
          <h3>{item.name}</h3>
          <p>Rs. {item.price}</p>
          <button onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}