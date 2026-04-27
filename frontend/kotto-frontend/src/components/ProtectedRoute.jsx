import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = user.role?.startsWith("ROLE_")
    ? user.role.replace("ROLE_", "")
    : user.role;

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}