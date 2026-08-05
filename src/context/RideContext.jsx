import { createContext, useContext, useState } from "react";

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideData, setRideData] = useState({
    source: "",
    destination: "",
    available_seats: 1,

    route: "",

    travel_date: "",
    travel_time: "",

    vehicle_id: null,
  });

  const updateRideData = (data) => {
    setRideData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetRideData = () => {
    setRideData({
      source: "",
      destination: "",
      available_seats: 1,
      route: "",
      travel_date: "",
      travel_time: "",
      vehicle_id: null,
    });
  };

  return (
    <RideContext.Provider
      value={{
        rideData,
        updateRideData,
        resetRideData,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  return useContext(RideContext);
};