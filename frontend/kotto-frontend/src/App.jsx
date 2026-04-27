import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import InventoryPage from "./pages/InventoryPage";
import AdminAddItemPage from "./pages/AdminAddItemPage";
import AdminEditItemPage from "./pages/AdminEditItemPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const location = useLocation();
  const authRoutes = ["/login", "/signin", "/signup", "/singin", "/forgot-password", "/reset-password", "/logout"];
  const hideNav = authRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          {!hideNav && <Navbar />}

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

            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/add-item"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminAddItemPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit-item/:id"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminEditItemPage />
                </ProtectedRoute>
              }
            />
 
            <Route path="/signin" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/singin" element={<Login />} />

            <Route path="*" element={<div style={{ padding: 24 }}>NOT FOUND</div>} />
          </Routes>

          {!hideNav && <Footer />}
          <CartDrawer />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}