import { useRide } from "../../context/RideContext";
import SearchBox from "../common/SearchBox";

const RideDetailsStep = () => {
  const { rideData, updateRideData } = useRide();

  const handleSeatsChange = (e) => {
    updateRideData({
      available_seats: Number(e.target.value),
    });
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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-8">Post a Ride</h1>

      <div className="space-y-6">
        <SearchBox
          label="Source"
          name="source"
          value={rideData.source || ""}
          onChange={handleSourceChange}
          onSelect={handleSourceSelect}
          placeholder="Enter source location..."
          required
        />

        <SearchBox
          label="Destination"
          name="destination"
          value={rideData.destination || ""}
          onChange={handleDestinationChange}
          onSelect={handleDestinationSelect}
          placeholder="Enter destination location..."
          required
        />

        <div>
          <label className="block mb-2 font-medium">Available Seats</label>

          <input
            type="number"
            min="1"
            name="available_seats"
            value={rideData.available_seats}
            onChange={handleSeatsChange}
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>
    </div>
  );
};

export default RideDetailsStep;