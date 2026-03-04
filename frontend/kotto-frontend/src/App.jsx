import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./Navbar";
import MenuPage from "./MenuPage";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CartProvider>
        <Navbar />
        <MenuPage />
        <CartDrawer />
      </CartProvider>
    </>
  )
}

export default App
