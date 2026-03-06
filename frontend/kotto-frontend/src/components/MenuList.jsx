import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import { getMenu } from "../services/menuService";
import "../styles/MenuPage.css";

function MenuList() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        // Assuming the backend returns an array of menu items
        setMenu(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Could not load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading delicious recipes...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "40px", color: "var(--danger)" }}>{error}</div>;
  }

  if (menu.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No items available at the moment.</div>;
  }

  return (
    <div className="menu-grid">
      {menu.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default MenuList;