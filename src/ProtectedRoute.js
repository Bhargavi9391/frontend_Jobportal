// src/ProtectedRoute.js
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, requiresAdmin = false }) {
  const isAuthenticated = localStorage.getItem("authenticatedUser");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return element;
}

export default ProtectedRoute;
