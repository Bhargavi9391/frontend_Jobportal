import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    // Not logged in at all
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Logged in but role mismatch
    // Redirect normal users to /home, admin to /admin
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    else return <Navigate to="/home" replace />;
  }

  return children;
}
