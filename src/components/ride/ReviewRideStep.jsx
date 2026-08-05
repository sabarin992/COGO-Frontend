import { useEffect, useMemo } from "react";

import { useRide } from "../../context/RideContext";

import { getVehicleById } from "../../services/vehicleService";

const ReviewRideStep = () => {
  const { rideData } = useRide();

  const formattedDate = useMemo(() => {
    if (!rideData.travel_date) return "-";

    return rideData.travel_date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [rideData.travel_date]);

  const formattedTime = useMemo(() => {
    if (!rideData.travel_time) return "-";

    return rideData.travel_time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [rideData.travel_time]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-3xl font-bold mb-2">Review Your Ride</h2>

      <p className="text-gray-500 mb-8">
        Please verify all details before publishing.
      </p>

      <div className="space-y-5">
        <ReviewItem label="Source" value={rideData.source} />

        <ReviewItem label="Destination" value={rideData.destination} />

        <ReviewItem label="Route" value={rideData.route} />

        <ReviewItem label="Travel Date" value={formattedDate} />

        <ReviewItem label="Travel Time" value={formattedTime} />

        <ReviewItem label="Available Seats" value={rideData.available_seats} />

        <ReviewItem
          label="Vehicle"
          value={
            rideData.vehicle
              ? `${rideData.vehicle.brand} ${rideData.vehicle.model}`
              : "-"
          }
        />
      </div>
    </div>
  );
};

const ReviewItem = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <span className="font-medium text-gray-500">{label}</span>

      <span className="font-semibold text-black">{value || "-"}</span>
    </div>
  );
};

export default ReviewRideStep;
