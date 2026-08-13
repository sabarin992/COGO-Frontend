import { useEffect, useState } from "react";

import { getMyRides, deleteRide } from "../../services/rideService";
import RideGrid from "../../components/ride/RideGrid";
import EmptyRideState from "../../components/ride/EmptyRideState";
import RideSkeleton from "../../components/ride/RideSkeleton";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const response = await getMyRides();

        setRides(response);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

  //   Delete Ride
  const handleDeleteClick = (ride) => {
    setSelectedRide(ride);
    setShowDeleteModal(true);
  };

  //   Confirm Delete function
  const handleConfirmDelete = async () => {
    if (!selectedRide) return;

    try {
      await deleteRide(selectedRide.ride_id);

      setRides((currentRides) =>
        currentRides.filter(
          (currentRide) => currentRide.ride_id !== selectedRide.ride_id,
        ),
      );

      setShowDeleteModal(false);
      setSelectedRide(null);

      toast.success("Ride deleted successfully.");
    } catch (error) {
      console.error("Failed to delete ride:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete ride. Please try again.",
      );
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <RideSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  // Empty State
  if (rides.length === 0) {
    return <EmptyRideState />;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Posted Rides</h1>

        <p className="text-gray-500 mt-2">Total Rides: {rides.length}</p>
      </div>

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
