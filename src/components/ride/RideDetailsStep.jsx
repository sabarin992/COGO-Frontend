import { useRide } from "../../context/RideContext";
import SearchBox from "../common/SearchBox";
import { Users, Minus, Plus, MapPin } from "lucide-react";

const RideDetailsStep = () => {
  const { rideData, updateRideData } = useRide();

  const seats = rideData.available_seats || 1;

  const handleSeatsChange = (delta) => {
    const newSeats = Math.max(1, Math.min(8, seats + delta));
    updateRideData({ available_seats: newSeats });
  };

  const handleSourceChange = (val) => {
    updateRideData({ source: val });
  };

  const handleSourceSelect = (detail) => {
    updateRideData({
      source: detail.place_name,
      ...(detail.coordinates && { source_coords: detail.coordinates }),
    });
  };

  const handleDestinationChange = (val) => {
    updateRideData({ destination: val });
  };

  const handleDestinationSelect = (detail) => {
    updateRideData({
      destination: detail.place_name,
      ...(detail.coordinates && { destination_coords: detail.coordinates }),
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ride Details</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Where are you starting from and where are you heading?
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Source Field */}
        <div>
          <SearchBox
            label="Source Location"
            name="source"
            value={rideData.source || ""}
            onChange={handleSourceChange}
            onSelect={handleSourceSelect}
            placeholder="Enter starting location..."
            // required
          />
        </div>

        {/* Destination Field */}
        <div>
          <SearchBox
            label="Destination Location"
            name="destination"
            value={rideData.destination || ""}
            onChange={handleDestinationChange}
            onSelect={handleDestinationSelect}
            placeholder="Enter destination location..."
            // required
          />
        </div>

        {/* Available Seats Selector */}
        <div className="pt-2">
          <label className="block mb-2 font-medium text-gray-700">
            Available Seats 
          </label>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Passenger Capacity</p>
                <p className="text-xs text-gray-500">Maximum passengers you can offer seats to</p>
              </div>
            </div>

            {/* Counter Control */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSeatsChange(-1)}
                disabled={seats <= 1}
                className="w-9 h-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>

              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {seats}
              </span>

              <button
                type="button"
                onClick={() => handleSeatsChange(1)}
                disabled={seats >= 8}
                className="w-9 h-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsStep;