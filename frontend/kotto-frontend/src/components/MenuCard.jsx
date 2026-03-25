import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "../styles/MenuCard.css";

function MenuCard({ item }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addToCart(item);
    addToast(`${item.name} added to cart!`, "success");
  };

  return (
    <div className="menu-card">

      <img src={item.image} alt={item.name} />

      <div className="card-content">

        <h3>{item.name}</h3>

        <p className="description">{item.description}</p>

        <div className="card-bottom">

          <span className="price">Rs {item.price}</span>

          <button onClick={handleAddToCart}>
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default MenuCard;