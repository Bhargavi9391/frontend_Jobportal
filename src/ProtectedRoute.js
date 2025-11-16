import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user")); // user.role must exist

  if (!token || !user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Logged in but role does not match
    return <Navigate to="/" replace />; // redirect to default page (could be Icon or login)
  }

  return children;
}
