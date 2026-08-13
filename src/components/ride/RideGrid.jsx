import React from "react";
import RideCard from "./RideCard";

const RideGrid = ({ rides, onView, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
