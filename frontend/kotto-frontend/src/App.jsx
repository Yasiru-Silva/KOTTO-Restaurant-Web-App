import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MenuPage from "./pages/MenuPage";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";

import ReservationPage from "./pages/ReservationPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      
      <Routes>
        {/* Home menu page */}
        <Route path="/menu" element={<MenuPage />} />

        {/* Reservation routes */}
        <Route path="/" element={<ReservationPage />} />
        <Route path="/reservation" element={<Navigate to="/" replace />} />

        {/* Auth routes */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Backward-compat route */}
        <Route path="/singin" element={<Login />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}