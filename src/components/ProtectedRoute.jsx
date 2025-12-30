import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdmin();

  // Prevent flicker while checking token via /admin/me
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
