import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ReservationPage from "./pages/ReservationPage";
import LoginPage from "./pages/LoginPage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <Routes>
      {/* Reservation routes (friend) */}
      <Route path="/" element={<ReservationPage />} />
      <Route path="/reservation" element={<Navigate to="/" replace />} />

      {/* Auth routes (dev) */}
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Backward-compat route (friend) */}
      <Route path="/singin" element={<Login />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}