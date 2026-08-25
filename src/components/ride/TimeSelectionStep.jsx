import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRide } from "../../context/RideContext";
import { Clock, Sun, Sunset, Moon, Sunrise } from "lucide-react";

const TimeSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const handleTimeChange = (time) => {
    updateRideData({
      travel_time: time,
    });
  };

  // Time Slot Presets
  const createPresetTime = (hours, minutes) => {
    const t = new Date();
    t.setHours(hours, minutes, 0, 0);
    return t;
  };

  const presets = [
    { label: "Morning (08:00 AM)", icon: Sunrise, time: createPresetTime(8, 0) },
    { label: "Afternoon (01:00 PM)", icon: Sun, time: createPresetTime(13, 0) },
    { label: "Evening (06:00 PM)", icon: Sunset, time: createPresetTime(18, 0) },
    { label: "Night (09:00 PM)", icon: Moon, time: createPresetTime(21, 0) },
  ];

  const isSameTime = (t1, t2) => {
    if (!t1 || !t2) return false;
    return t1.getHours() === t2.getHours() && t1.getMinutes() === t2.getMinutes();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Departure Time</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Select what time you plan to start your journey.
        </p>
      </div>

      {/* Time Slot Presets */}
      <div className="mb-6">
        <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Popular Slots
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((preset, index) => {
            const Icon = preset.icon;
            const isSelected = isSameTime(rideData.travel_time, preset.time);
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleTimeChange(preset.time)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                <Icon size={18} className={isSelected ? "text-white" : "text-gray-500"} />
                <span className="text-xs font-medium text-center">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Picker */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Exact Departure Time <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Clock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
          />

          <DatePicker
            selected={rideData.travel_time}
            onChange={handleTimeChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Click to select departure time"
            className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 text-base font-medium text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      {/* Selected Time Summary Card */}
      {rideData.travel_time && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Selected Departure Time</p>
            <p className="font-semibold text-gray-900 text-sm">
              {rideData.travel_time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelectionStep;