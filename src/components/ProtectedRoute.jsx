// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // If no token, bounce them to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 💡 Aha! The Outlet renders the nested child component dynamically
  return <Outlet />;
};
