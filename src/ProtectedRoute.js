import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && (!user || user.role !== role)) {
    // Logged in but role does not match
    return <Navigate to="/home" replace />; 
  }

  return children;
}
