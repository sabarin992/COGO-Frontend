import React from "react";
import RideSearchCard from "./RideSearchCard";

const RideSearchList = ({ rides, seatRequired }) => {
  if (!rides || rides.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          No rides found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't find any rides matching your search.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Available Rides
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {rides.length} ride{rides.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {rides.map((ride) => (
          <RideSearchCard
            key={ride.ride_id}
            ride={ride}
            seatRequired={seatRequired}
          />
        ))}
      </div>
    </div>
  );
};

export default RideSearchList;