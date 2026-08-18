import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRide } from "../../context/RideContext";
import { Calendar, Sparkles } from "lucide-react";

const DateSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const handleDateChange = (date) => {
    updateRideData({
      travel_date: date,
    });
  };

  // Quick Date Presets
  const getPresetDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  const presets = [
    { label: "Today", date: getPresetDate(0) },
    { label: "Tomorrow", date: getPresetDate(1) },
    { label: "In 2 Days", date: getPresetDate(2) },
    { label: "Next Week", date: getPresetDate(7) },
  ];

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Travel Date</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Select the date you plan to embark on this journey.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Quick Suggestions
        </label>

        <div className="flex flex-wrap gap-2">
          {presets.map((preset, index) => {
            const isSelected = isSameDay(rideData.travel_date, preset.date);
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateChange(preset.date)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-black text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* DatePicker Field */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Select Date <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Calendar
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
          />

          <DatePicker
            selected={rideData.travel_date}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="EEEE, dd MMMM yyyy"
            placeholderText="Click to select journey date"
            className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 text-base font-medium text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      {/* Selected Summary Card */}
      {rideData.travel_date && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Selected Date</p>
            <p className="font-semibold text-gray-900 text-sm">
              {rideData.travel_date.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelectionStep;