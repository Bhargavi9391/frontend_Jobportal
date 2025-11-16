// src/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiresAdmin = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If NO token → user is not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If Admin route but role is NOT admin → block
  if (requiresAdmin && role !== "admin") {
    return <Navigate to="/home" />;
  }

  // All good → allow access
  return element;
};

export default ProtectedRoute;
