import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking authentication
  if (loading || isAuthenticated === null) {
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
  return <Navigate to="/" replace />;
};

export default PublicRoute;