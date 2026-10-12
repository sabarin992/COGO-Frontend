import { useEffect, useState } from "react";
import { getVehicles } from "../../services/vehicleService";
import VehicleCard from "../vehicle/VehicleCard";
import EmptyVehicleState from "../vehicle/EmptyVehicleState";
import { useRide } from "../../context/RideContext";
import { Loader2 } from "lucide-react";

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
        <p className="text-xs text-gray-400 mt-1">
          Vehicles must have at least <span className="font-semibold text-gray-600">{rideData.available_seats} seat{rideData.available_seats > 1 ? "s" : ""}</span> available for this ride.
        </p>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => {
          const isSelected = rideData.vehicle_id === vehicle.id;
          const isDisabled = (vehicle.seating_capacity ?? 0) < rideData.available_seats;

          return (
            <div
              key={vehicle.id}
              onClick={() => {
                if (!isDisabled) {
                  updateRideData({
                    vehicle_id: vehicle.id,
                    vehicle: vehicle,
                  });
                }
              }}
              className={`transition-transform duration-200 ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-[1.01]"}`}
            >
              <div className="relative">
                {isDisabled && (
                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-amber-50 border-t border-amber-200 px-4 py-2.5 rounded-b-3xl">
                    <span className="text-amber-500 text-base">⚠️</span>
                    <p className="text-xs text-amber-700 font-medium">
                      Not enough seats — this vehicle only has {vehicle.seating_capacity} seat{vehicle.seating_capacity !== 1 ? "s" : ""}, but you need {rideData.available_seats}.
                    </p>
                  </div>
                )}
                <VehicleCard
                  vehicle={vehicle}
                  selectable
                  selected={isSelected}
                  onSelect={(v) => {
                    if (!isDisabled) {
                      updateRideData({
                        vehicle_id: v.id,
                        vehicle: v,
                      });
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelectionStep;
