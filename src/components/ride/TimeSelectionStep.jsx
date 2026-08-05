import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useRide } from "../../context/RideContext";

const TimeSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const handleTimeChange = (time) => {
    updateRideData({
      travel_time: time,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-2">
        Choose Departure Time
      </h2>

      <p className="text-gray-500 mb-8">
        Select the departure time for your ride.
      </p>

      <DatePicker
        selected={rideData.travel_time}
        onChange={handleTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        placeholderText="Select departure time"
        className="w-full border rounded-lg p-4 text-lg"
      />

    </div>
  );
};

export default TimeSelectionStep;