import { useRide } from "../../context/RideContext";
import { useEffect, useState } from "react";
import { getRoutes } from "../../services/rideService";


const RouteSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
  const loadRoutes = async () => {
    const data = await getRoutes(
      rideData.source,
      rideData.destination
    );

    setRoutes(data);
  };

  loadRoutes();
}, [rideData.source, rideData.destination]);

  const handleSelectRoute = (route) => {
    updateRideData({
      route: route.name,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-2">
        Choose Your Route
      </h2>

      <p className="text-gray-500 mb-8">
        Select the route you prefer for this ride.
      </p>

      <div className="space-y-4">

        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => handleSelectRoute(route)}
            className={`cursor-pointer rounded-xl border p-5 transition-all duration-200
              ${
                rideData.route === route.name
                  ? "border-black bg-gray-100"
                  : "border-gray-200 hover:border-black"
              }`}
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="text-lg font-semibold">
                  {route.name}
                </h3>

                <div className="flex gap-6 mt-2 text-gray-600">

                  <span>
                    📍 {route.distance}
                  </span>

                  <span>
                    🕒 {route.duration}
                  </span>

                </div>

              </div>

              <div>

                <input
                  type="radio"
                  checked={rideData.route === route.name}
                  readOnly
                />

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default RouteSelectionStep;