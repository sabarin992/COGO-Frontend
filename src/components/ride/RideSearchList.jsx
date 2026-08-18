import React from "react";
import RideSearchCard from "./RideSearchCard";
import { SearchX, Car } from "lucide-react";

const RideSearchList = ({ rides, seatRequired }) => {
  if (!rides || rides.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
          <SearchX size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">No Rides Found</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          We couldn't find any available rides matching your journey. Try adjusting your travel date or locations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Counter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Rides</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Select a ride to view driver details and request your seats.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-semibold shadow-sm flex items-center gap-1.5">
          <Car size={14} />
          {rides.length} {rides.length === 1 ? "Ride" : "Rides"} Found
        </span>
      </div>

      {/* Ride Cards List */}
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