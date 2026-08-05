import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useRide } from "../../context/RideContext";

const DateSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const handleDateChange = (date) => {
    updateRideData({
      travel_date: date,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-3xl font-bold mb-2">
        Choose Travel Date
      </h2>

      <p className="text-gray-500 mb-8">
        Select your journey date.
      </p>

      <DatePicker
        selected={rideData.travel_date}
        onChange={handleDateChange}
        minDate={new Date()}
        dateFormat="dd MMMM yyyy"
        placeholderText="Select a travel date"
        className="w-full border rounded-lg p-4 text-lg"
      />

    </div>
  );
};

export default DateSelectionStep;