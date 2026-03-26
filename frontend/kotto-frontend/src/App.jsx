import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MenuPage from "./pages/MenuPage";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

import ReservationPage from "./pages/ReservationPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import ProfilePage from "./pages/ProfilePage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Navbar />
 
          <Routes>
            <Route path="/menu" element={<Navigate to="/" replace />} />
 
            <Route path="/" element={<MenuPage />} />
 
            <Route path="/reservation" element={<ReservationPage />} />
 
            <Route path="/checkout" element={<CheckoutPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
 
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminReservationsPage />
                </ProtectedRoute>
              }
            />
 
            <Route path="/signin" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/singin" element={<Login />} />
 
            <Route path="*" element={<div style={{ padding: 24 }}>NOT FOUND</div>} />
          </Routes>
 
          <Footer />
          <CartDrawer />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}