import React from "react";
import RideCard from "./RideCard";

const RideGrid = ({ rides, onView, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {rides.map((ride) => (
        <RideCard
          key={ride.ride_id}
          ride={ride}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default RideGrid;
