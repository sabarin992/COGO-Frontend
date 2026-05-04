import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user/check-auth");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // While checking auth
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // if Not authenticated → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if Authenticated then show page
  return children;
};

export default ProtectedRoute;