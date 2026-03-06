import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  }, [navigate]);

  return null; // or <div>Logging out...</div>
}