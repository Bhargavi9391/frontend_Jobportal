import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, requiresAdmin = false }) {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  if (requiresAdmin && !adminToken) {
    return <Navigate to="/login" />;
  }

  if (!requiresAdmin && !userToken) {
    return <Navigate to="/login" />;
  }

  return element;
}

export default ProtectedRoute;
