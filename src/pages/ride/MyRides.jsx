import { useEffect, useState } from "react";

import { getMyRides } from "../../services/rideService";
import RideGrid from "../../components/ride/RideGrid";
import EmptyRideState from "../../components/ride/EmptyRideState";
import RideSkeleton from "../../components/ride/RideSkeleton";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

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
          console.log("Selected Ride:", ride);
        }}
      />
    </div>
  );
};

export default MyRides;
