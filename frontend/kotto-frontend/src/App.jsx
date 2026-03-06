import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";        // Global navbar shown on every page
import MenuPage from "./pages/MenuPage";         // Menu page (home page)
import Footer from "./components/Footer";        // Global footer shown on every page
import CartDrawer from "./components/CartDrawer";// Global cart drawer
import { CartProvider } from "./context/CartContext";

import ReservationPage from "./pages/ReservationPage"; // Reservation page component
import Login from "./pages/Login";              // Login page
import Register from "./pages/Register";        // Register page
import Logout from "./pages/Logout";            // Logout page

export default function App() {
  return (
    <CartProvider>

      {/* Navbar appears on ALL pages */}
      {/* If the mysterious reservation UI appears everywhere, 
         also check inside Navbar.jsx */}
      <Navbar />
      
      <Routes>

        {/* Redirect /menu → / (keeps only one home URL) */}
        <Route path="/menu" element={<Navigate to="/" replace />} />

        {/* Home page (Menu) */}
        <Route path="/" element={<MenuPage />} />
        {/* If reservation UI appears at bottom of menu,
           check inside MenuPage.jsx */}

        {/* Reservation page */}
        <Route path="/reservation" element={<ReservationPage />} />
        {/* Reservation UI should ONLY appear in this component */}

        {/* Authentication pages */}
        <Route path="/signin" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Typo compatibility route */}
        <Route path="/singin" element={<Login />} />

        {/* Fallback route for unknown URLs */}
        {/* You earlier had redirect to "/", but we replaced it temporarily 
           to help debug routing */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        <Route path="*" element={<div style={{ padding: 24 }}>NOT FOUND</div>} />
      </Routes>

      {/* Footer appears on ALL pages */}
      {/* If reservation UI appears on login/register pages,
         also check Footer.jsx */}
      <Footer />

      {/* Cart drawer is global */}
      {/* Also check CartDrawer.jsx if unexpected UI appears */}
      <CartDrawer />

    </CartProvider>
  );
}