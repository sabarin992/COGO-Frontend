import React from "react";
import VehicleCard from "./VehicleCard";

const VehicleGrid = ({ vehicles, onEdit, onDelete }) => {
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default VehicleGrid;
