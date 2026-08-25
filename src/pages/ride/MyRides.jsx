import React, { useEffect, useState } from "react";
import { getMyRides, deleteRide } from "../../services/rideService";
import RideGrid from "../../components/ride/RideGrid";
import EmptyRideState from "../../components/ride/EmptyRideState";
import RideSkeleton from "../../components/ride/RideSkeleton";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";
import { Plus, Car } from "lucide-react";

import { getUserProfile } from "../../services/userService";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        setLoading(true);
        const response = await getMyRides();
        setRides(response || []);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
        toast.error("Unable to load your rides. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

  // Delete Ride trigger
  const handleDeleteClick = (ride) => {
    setSelectedRide(ride);
    setShowDeleteModal(true);
  };

  // Confirm Delete function
  const handleConfirmDelete = async () => {
    if (!selectedRide) return;

    try {
      await deleteRide(selectedRide.ride_id);

      setRides((currentRides) =>
        currentRides.filter(
          (currentRide) => currentRide.ride_id !== selectedRide.ride_id
        )
      );

      setShowDeleteModal(false);
      setSelectedRide(null);

      toast.success("Ride deleted successfully.");
    } catch (error) {
      console.error("Failed to delete ride:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to delete ride. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded-xl w-64 animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <RideSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (rides.length === 0) {
    return <EmptyRideState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Posted Rides</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your active ride offerings, view route details, and check incoming passenger requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 shrink-0">
            <Car size={14} />
            {rides.length} {rides.length === 1 ? "Active Ride" : "Active Rides"}
          </span>

          <button
            type="button"
            onClick={handlePostRideClick}
            className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition shrink-0"
          >
            <Plus size={16} />
            <span>Post a Ride</span>
          </button>
        </div>
      </div>

      {/* Ride Grid */}
      <RideGrid
        rides={rides}
        onView={(ride) => {
          navigate(`/ride/my-rides/${ride.ride_id}`);
        }}
        onDelete={handleDeleteClick}
      />

      {/* Ride Deletion Confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRide(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Ride?"
        message="Are you sure you want to delete this ride? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default MyRides;
