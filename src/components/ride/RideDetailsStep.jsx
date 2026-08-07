import { useEffect } from "react";
import { useRide } from "../../context/RideContext";

const RideDetailsStep = () => {
  const { rideData, updateRideData } = useRide();

  const handleChange = (e) => {
    const { name, value } = e.target;

    updateRideData({
      [name]:
        name === "available_seats"
          ? Number(value)
          : value,
    });
  };

  

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Post a Ride
      </h1>

      <div className="space-y-6">

        <div>
          <label className="block mb-2 font-medium">
            Source
          </label>

          <input
            type="text"
            name="source"
            value={rideData.source}
            onChange={handleChange}
            placeholder="Enter source"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Destination
          </label>

          <input
            type="text"
            name="destination"
            value={rideData.destination}
            onChange={handleChange}
            placeholder="Enter destination"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Available Seats
          </label>

          <input
            type="number"
            min="1"
            name="available_seats"
            value={rideData.available_seats}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

    </div>
  );
};

export default RideDetailsStep;