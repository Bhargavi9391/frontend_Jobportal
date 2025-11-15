// src/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiresAdmin = false }) => {
  const isLoggedIn = localStorage.getItem("authenticatedUser");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // If user is NOT logged in → redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If route REQUIRES admin but the user is NOT admin → redirect to home
  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/home" />;
  }

  // Otherwise allow access
  return element;
};

export default ProtectedRoute;
