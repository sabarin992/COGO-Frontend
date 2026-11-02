import { createContext, useContext, useEffect, useState } from "react";

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideData, setRideData] = useState({
    source: "",
    destination: "",
    available_seats: 1,

    route: "",

    route_geometry: [],

    travel_date: null,
    travel_time: null,

    vehicle_id: null,
    vehicle: null,

    // Recurrence configuration
    recurrence_type: "ONCE", // "ONCE" | "DAILY" | "WEEKDAYS" | "SHIFT" | "CUSTOM"
    start_date: null,
    end_date: null,
    selected_weekdays: [], // [0, 1, 2...] for Mon, Tue, Wed...
    working_days: 2,
    off_days: 2,
    shift_start_date: null,
  });

  useEffect(() => {
    console.log(rideData);
  }, [rideData]);

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
      route_geometry: [],
      travel_date: null,
      travel_time: null,
      vehicle_id: null,
      vehicle: null,

      recurrence_type: "ONCE",
      start_date: null,
      end_date: null,
      selected_weekdays: [],
      working_days: 2,
      off_days: 2,
      shift_start_date: null,
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
