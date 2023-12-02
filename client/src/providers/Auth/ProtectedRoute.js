import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
