import React from "react";
import { CarFront } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyRideState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <CarFront className="w-12 h-12 text-gray-400" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900">
        No Rides Found
      </h2>

      <p className="mt-3 text-gray-500 text-center max-w-md">
        You haven't posted any rides yet.
        Create your first ride and start sharing your journey.
      </p>

      <button
        onClick={() => navigate("/ride/post-ride")}
        className="mt-8 bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Post Your First Ride
      </button>
    </div>
  );
};

export default EmptyRideState;