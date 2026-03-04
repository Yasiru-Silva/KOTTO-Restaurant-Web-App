import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReservationPage from "./pages/ReservationPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Single-page front-end: Home routes to Reservation UI */}
        <Route path="/" element={<ReservationPage />} />
        <Route path="/reservation" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
