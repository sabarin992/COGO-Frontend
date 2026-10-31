
import React from "react";
import RideCard from "./RideCard";

const RideGrid = ({ rides, onView, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 min-w-0">
      {rides.map((ride) => (
        <div key={ride.ride_id} className="min-w-0">
          <RideCard
            ride={ride}
            onView={onView}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default RideGrid;

