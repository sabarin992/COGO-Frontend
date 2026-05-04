import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api"; // your axios instance

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user/check-auth"); 
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // While checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // If NOT logged in allow access (show login/signup)
  if (!isAuthenticated) {
    return children;
  }

  // If already logged in redirect to home
  return <Navigate to="/home" replace />;
};

export default PublicRoute;