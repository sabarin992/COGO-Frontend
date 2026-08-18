import { useEffect, useState } from "react";
import { getVehicles } from "../../services/vehicleService";
import VehicleCard from "../vehicle/VehicleCard";
import EmptyVehicleState from "../vehicle/EmptyVehicleState";
import { useRide } from "../../context/RideContext";
import { Car, Loader2 } from "lucide-react";

const VehicleSelectionStep = () => {
  const { rideData, updateRideData } = useRide();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
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
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[360px]">
        <Loader2 size={36} className="animate-spin text-black mb-3" />
        <p className="text-gray-600 font-medium text-sm">Loading your registered vehicles...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <EmptyVehicleState />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Vehicle</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Choose which of your registered vehicles you will be driving for this ride.
        </p>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => {
          const isSelected = rideData.vehicle_id === vehicle.id;
          return (
            <div
              key={vehicle.id}
              onClick={() =>
                updateRideData({
                  vehicle_id: vehicle.id,
                  vehicle: vehicle,
                })
              }
              className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                isSelected
                  ? "border-black bg-gray-900 text-white shadow-lg scale-[1.01]"
                  : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
              }`}
            >
              <VehicleCard
                vehicle={vehicle}
                selectable
                selected={isSelected}
                onSelect={(v) =>
                  updateRideData({
                    vehicle_id: v.id,
                    vehicle: v,
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelectionStep;
