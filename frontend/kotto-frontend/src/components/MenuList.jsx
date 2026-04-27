import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import { useAuth } from "../context/AuthContext";
import { getMenu } from "../services/menuService";
import "../styles/MenuPage.css";

function MenuList({ moodId, categoryId, refreshKey, onMenuChanged, onlyBestSellers }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const normalizedRole = user?.role?.startsWith("ROLE_")
    ? user.role.replace("ROLE_", "")
    : user?.role;
  const isAdmin = normalizedRole === "ADMIN";

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = await getMenu(moodId, categoryId);
        if (onlyBestSellers) {
          data = data.filter(item => item.bestSeller);
        }
        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Could not load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [moodId, categoryId, refreshKey, onlyBestSellers]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "var(--text-muted)",
        }}
      >
        Loading delicious recipes...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "var(--danger)",
        }}
      >
        {error}
      </div>
    );
  }

  if (menu.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "var(--text-muted)",
        }}
      >
        {onlyBestSellers 
          ? "No best deals available right now." 
          : "No dishes match these filters. Try another mood or category."}
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {menu.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          isAdmin={isAdmin}
          onMenuChanged={onMenuChanged}
        />
      ))}
    </div>
  );
}

export default MenuList;
