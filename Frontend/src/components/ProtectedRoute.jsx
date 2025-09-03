// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
}
