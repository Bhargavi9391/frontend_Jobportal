// src/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiresAdmin = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token → user not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If admin route → check role
  if (requiresAdmin && role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // Allow access
  return element;
};

export default ProtectedRoute;
