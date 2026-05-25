import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking auth
  if (loading || isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // if Not authenticated → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if Authenticated then show page
  return children;
};

export default ProtectedRoute;