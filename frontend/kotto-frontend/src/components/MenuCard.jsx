import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { deleteMenuItem } from "../services/adminMenuService";
import "../styles/MenuCard.css";

function MenuCard({ item, isAdmin, onMenuChanged }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
    addToast(`${item.name} added to cart!`, "success");
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${item.name}” from the menu?`)) return;
    setDeleting(true);
    try {
      await deleteMenuItem(item.id);
      addToast("Item removed from menu.", "success");
      onMenuChanged?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Could not delete item.";
      addToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/edit-item/${item.id}`);
  };

  const showImg = item.image && !imgFailed;

  return (
    <div className="menu-card">
      <div className="menu-card-image-wrap">
        {showImg ? (
          <img
            src={item.image}
            alt=""
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="menu-card-placeholder" aria-hidden>
            🍽️
          </div>
        )}
      </div>

      <div className="card-content">
        {item.category?.name ? (
          <span className="menu-card-category">{item.category.name}</span>
        ) : null}

        <h3>{item.name}</h3>

        {item.moods?.length ? (
          <div className="menu-card-moods">
            {item.moods.map((m) => (
              <span key={m.id} className="menu-mood-tag">
                {m.name}
              </span>
            ))}
          </div>
        ) : null}

        <p className="description">{item.description}</p>

        {isAdmin ? (
          <div className="menu-card-admin-actions">
            <button
              type="button"
              className="menu-admin-btn menu-admin-edit"
              onClick={handleEdit}
            >
              Customize
            </button>
            <button
              type="button"
              className="menu-admin-btn menu-admin-delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "…" : "Delete"}
            </button>
          </div>
        ) : null}

        <div className="card-bottom">
          <span className="price">
            LKR {Number(item.price).toLocaleString()}
          </span>

          <button type="button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
