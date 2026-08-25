import React from "react";
import { Car, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserProfile } from "../../services/userService";

const EmptyRideState = () => {
  const navigate = useNavigate();

  const handlePostRideClick = async () => {
    try {
      const data = await getUserProfile();
      if (data && data.role === "rider") {
        navigate("/ride/post-ride");
      } else {
        toast.error("Only users with the Rider role can post a ride.");
      }
    } catch (err) {
      toast.error("Only users with the Rider role can post a ride.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm flex flex-col items-center max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <Car size={32} />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1">No Posted Rides Found</h2>

      <p className="text-sm text-gray-500 max-w-sm mb-6">
        You haven't posted any rides yet. Create your first ride offer and start sharing your journey with passengers.
      </p>

      <button
        type="button"
        onClick={handlePostRideClick}
        className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95"
      >
        <Plus size={18} />
        <span>Post Your First Ride</span>
      </button>
    </div>
  );
};

export default EmptyRideState;