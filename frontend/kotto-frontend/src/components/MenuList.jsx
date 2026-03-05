import MenuCard from "./MenuCard";
import "../styles/MenuPage.css";

const sampleMenu = [
  {
    id: 1,
    name: "Chicken Kottu",
    price: 1200,
    description: "Delicious Sri Lankan street food",
    image:
      "https://images.unsplash.com/photo-1604908176997-431b3e3c42f6"
  },
  {
    id: 2,
    name: "Cheese Kottu",
    price: 1300,
    description: "Loaded with melted cheese",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    id: 3,
    name: "Seafood Kottu",
    price: 1500,
    description: "Fresh seafood mix",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
  },
  {
    id: 4,
    name: "Veg Kottu",
    price: 1000,
    description: "Healthy vegetarian option",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
  }
];

function MenuList() {

  return (
    <div className="menu-grid">

      {sampleMenu.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}

    </div>
  );
}

export default MenuList;