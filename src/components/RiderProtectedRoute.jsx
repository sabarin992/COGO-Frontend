import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserProfile } from "../services/userService";
import { toast } from "react-toastify";

const RiderProtectedRoute = ({ children }) => {
  const [isRider, setIsRider] = useState(null);

  useEffect(() => {
    const checkRiderAuth = async () => {
      try {
        const data = await getUserProfile();
        if (data && data.role === "rider") {
          setIsRider(true);
        } else {
          toast.error("Only users with the Rider role can post a ride.");
          setIsRider(false);
        }
      } catch (error) {
        console.error("Failed to verify user role:", error);
        toast.error("Only users with the Rider role can post a ride.");
        setIsRider(false);
      }
    };

    checkRiderAuth();
  }, []);

  // Loader while checking role
  if (isRider === null) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 mt-3 font-medium">
          Verifying rider permissions...
        </p>
      </div>
    );
  }

  // Redirect if not a rider
  if (!isRider) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RiderProtectedRoute;
