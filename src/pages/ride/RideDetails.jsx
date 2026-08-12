import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRideById } from "../../services/rideService";

const RideDetails = () => {
  const { rideId } = useParams();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await getRideById(rideId);

        setRide(response);
      } catch (error) {
        console.error("Failed to fetch ride:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-lg font-semibold text-gray-600">Loading ride...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-lg font-semibold text-red-500">Ride not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Ride Details</h1>

        <p className="text-gray-500 mt-2">
          View the details of your posted ride.
        </p>
      </div>

      {/* Ride Details Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Route Header */}
        <div className="flex bg-black text-white px-8 py-7 justify-between">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              Route
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {ride.source} → {ride.destination}
            </h2>
          </div>
          <div className="flex gap-3">
            <h2 className="text-3xl font-bold mt-2 cursor-pointer" onClick={()=>{navigate(`/ride/my-rides/edit/${rideId}`)}}>
              Edit
            </h2>
            <h2 className="text-3xl font-bold mt-2">
              Delete
            </h2>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Date */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Travel Date
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                {ride.travel_date}
              </p>
            </div>

            {/* Time */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Travel Time
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                {ride.travel_time}
              </p>
            </div>

            {/* Seats */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Available Seats
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                {ride.available_seats}
              </p>
            </div>

            {/* Route */}
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Selected Route
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                {ride.route || "No route information"}
              </p>
            </div>

            {/* Vehicle */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Vehicle
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                Vehicle #{ride.vehicle_id}
              </p>
            </div>

            {/* Ride ID */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Ride ID
              </p>

              <p className="text-lg font-semibold text-gray-900 mt-2">
                #{ride.ride_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to my rides */}
      <button
        onClick={() => navigate("/ride/my-rides")}
        className="mt-8 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition"
      >
        Back to My Rides
      </button>
    </div>
  );
};

export default RideDetails;
