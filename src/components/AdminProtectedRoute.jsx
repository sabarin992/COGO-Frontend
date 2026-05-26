import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserProfile } from "../services/userService";

const AdminProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const data = await getUserProfile();
        if (data && data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdminAuth();
  }, []);

  // Show premium loader while verifying credentials
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 mt-3 font-medium">Verifying console access...</p>
      </div>
    );
  }

  // Redirect to admin sign-in if not an authorized administrator
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
