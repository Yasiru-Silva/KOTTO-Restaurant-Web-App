import { useCart } from "../context/CartContext";
import "../styles/MenuCard.css";

function MenuCard({ item }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    // Optionally, still show an alert or open the cart
    alert(item.name + " added to cart!");
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