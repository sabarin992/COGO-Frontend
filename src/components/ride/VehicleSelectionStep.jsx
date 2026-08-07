import { useEffect, useState } from "react";

import { getVehicles } from "../../services/vehicleService";

import VehicleCard from "../vehicle/VehicleCard";

import EmptyVehicleState from "../vehicle/EmptyVehicleState";

import { useRide } from "../../context/RideContext";

const VehicleSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await getVehicles();

        setVehicles(vehicles);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-lg font-medium text-gray-500">
          Loading your vehicles...
        </p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return <EmptyVehicleState />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Select Your Vehicle</h2>

        <p className="text-gray-500 mt-2">
          Choose the vehicle you want to use for this ride.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            selectable
            selected={rideData.vehicle_id === vehicle.id}
            onSelect={(vehicle) => {
              updateRideData({
                vehicle_id: vehicle.id,
                vehicle:vehicle
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VehicleSelectionStep;
