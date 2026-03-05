import "../styles/Navbar.css";

function Navbar() {

  const scrollMenu = () => {
    const section = document.getElementById("menu-section");
    section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar">

      <h2 className="logo">KOTTO</h2>

      <div className="nav-links">
        <button onClick={scrollMenu}>Menu</button>
        <button>Cart</button>
      </div>

    </nav>
  );
}

export default Navbar;