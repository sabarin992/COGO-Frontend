import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRide } from "../../context/RideContext";
import {
  Calendar,
  Repeat,
  Briefcase,
  RotateCw,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import {
  RECURRENCE_OPTIONS,
  WEEKDAYS,
  calculateProjectedDates,
  formatRecurrenceLabel,
} from "../../utils/recurrenceUtils";

const DateSelectionStep = () => {
  const { rideData, updateRideData } = useRide();

  const normalizeDate = (d) => {
    if (!d) return null;
    const normalized = new Date(d);
    normalized.setHours(12, 0, 0, 0);
    return normalized;
  };

  const handleSingleDateChange = (date) => {
    const norm = normalizeDate(date);
    updateRideData({
      travel_date: norm,
      start_date: norm,
      end_date: norm,
    });
  };

  const handleStartDateChange = (date) => {
    const norm = normalizeDate(date);
    // If end_date is before new start_date, adjust end_date to start_date
    let newEnd = rideData.end_date;
    if (newEnd && newEnd < norm) {
      newEnd = norm;
    }
    updateRideData({
      start_date: norm,
      travel_date: norm,
      end_date: newEnd,
      shift_start_date: rideData.shift_start_date || norm,
    });
  };

  const handleEndDateChange = (date) => {
    updateRideData({
      end_date: normalizeDate(date),
    });
  };

  const handleRecurrenceChange = (type) => {
    const updates = { recurrence_type: type };
    // Synchronize initial dates when switching
    if (type !== "ONCE") {
      const initialStart = rideData.start_date || rideData.travel_date || normalizeDate(new Date());
      updates.start_date = initialStart;
      if (!rideData.end_date) {
        const defaultEnd = new Date(initialStart);
        defaultEnd.setDate(defaultEnd.getDate() + 7);
        updates.end_date = normalizeDate(defaultEnd);
      }
      if (type === "SHIFT" && !rideData.shift_start_date) {
        updates.shift_start_date = initialStart;
      }
      if (type === "CUSTOM" && (!rideData.selected_weekdays || rideData.selected_weekdays.length === 0)) {
        updates.selected_weekdays = [0, 2, 4]; // Default Mon, Wed, Fri
      }
    } else {
      updates.travel_date = rideData.start_date || rideData.travel_date || normalizeDate(new Date());
    }
    updateRideData(updates);
  };

  const toggleWeekday = (dayId) => {
    const current = rideData.selected_weekdays || [];
    const exists = current.includes(dayId);
    let updated;
    if (exists) {
      updated = current.filter((id) => id !== dayId);
    } else {
      updated = [...current, dayId].sort((a, b) => a - b);
    }
    updateRideData({ selected_weekdays: updated });
  };

  // Quick Date Presets for ONCE
  const getPresetDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return normalizeDate(d);
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

  // Live calculation of projected dates
  const projectedDates = useMemo(() => {
    return calculateProjectedDates({
      recurrence_type: rideData.recurrence_type,
      start_date: rideData.start_date || rideData.travel_date,
      end_date: rideData.end_date || rideData.travel_date,
      selected_weekdays: rideData.selected_weekdays,
      working_days: rideData.working_days,
      off_days: rideData.off_days,
      shift_start_date: rideData.shift_start_date,
    });
  }, [
    rideData.recurrence_type,
    rideData.start_date,
    rideData.travel_date,
    rideData.end_date,
    rideData.selected_weekdays,
    rideData.working_days,
    rideData.off_days,
    rideData.shift_start_date,
  ]);

  const recurrenceIcons = {
    ONCE: Calendar,
    DAILY: Repeat,
    WEEKDAYS: Briefcase,
    SHIFT: RotateCw,
    CUSTOM: SlidersHorizontal,
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Schedule & Recurrence</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Choose whether this is a one-time ride or set a recurring schedule to automatically offer rides.
        </p>
      </div>

      {/* Recurrence Mode Selector */}
      <div>
        <label className="block mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Repeat Ride
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {RECURRENCE_OPTIONS.map((opt) => {
            const isSelected = rideData.recurrence_type === opt.id;
            const IconComponent = recurrenceIcons[opt.id] || Calendar;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleRecurrenceChange(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-black bg-black text-white shadow-sm ring-1 ring-black"
                    : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent size={18} className={isSelected ? "text-white" : "text-gray-600"} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>
                <div>
                  <p className="font-semibold text-xs leading-tight">{opt.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: One-Time Ride (Behaves exactly like existing functionality) */}
      {rideData.recurrence_type === "ONCE" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Presets */}
          <div>
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
                    onClick={() => handleSingleDateChange(preset.date)}
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

          {/* Single DatePicker Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Select Journey Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              />
              <DatePicker
                selected={rideData.travel_date}
                onChange={handleSingleDateChange}
                minDate={new Date()}
                dateFormat="EEEE, dd MMMM yyyy"
                placeholderText="Click to select journey date"
                className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 text-base font-medium text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Recurring Ride Configuration */}
      {rideData.recurrence_type !== "ONCE" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Date Range Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                />
                <DatePicker
                  selected={rideData.start_date}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  dateFormat="EEEE, dd MMMM yyyy"
                  placeholderText="Select start date"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                />
                <DatePicker
                  selected={rideData.end_date}
                  onChange={handleEndDateChange}
                  minDate={rideData.start_date || new Date()}
                  maxDate={
                    rideData.start_date
                      ? new Date(new Date(rideData.start_date).getTime() + 90 * 24 * 60 * 60 * 1000)
                      : null
                  }
                  dateFormat="EEEE, dd MMMM yyyy"
                  placeholderText="Select end date"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Maximum recurrence range is 90 days.</p>
            </div>
          </div>

          {/* Sub-config: SHIFT WORKDAYS */}
          {rideData.recurrence_type === "SHIFT" && (
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <RotateCw size={16} className="text-blue-600" />
                <span>Configure Rotating Shift Pattern</span>
              </div>
              <p className="text-xs text-blue-700">
                Configure your continuous rotating work and off days pattern. Rides are generated exclusively on working days.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Working Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rideData.working_days || 2}
                    onChange={(e) =>
                      updateRideData({ working_days: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-[11px] text-gray-500">Consecutive work days</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Off Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rideData.off_days || 2}
                    onChange={(e) =>
                      updateRideData({ off_days: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-[11px] text-gray-500">Consecutive off days</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Pattern Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={rideData.shift_start_date || rideData.start_date || new Date()}
                      onChange={(d) => updateRideData({ shift_start_date: normalizeDate(d) })}
                      dateFormat="dd MMM yyyy"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500">Cycle anchor date</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-config: CUSTOM WEEKDAYS */}
          {rideData.recurrence_type === "CUSTOM" && (
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Select Active Weekdays <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateRideData({ selected_weekdays: [0, 1, 2, 3, 4] })}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Weekdays
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => updateRideData({ selected_weekdays: [5, 6] })}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Weekends
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => {
                  const isChecked = (rideData.selected_weekdays || []).includes(day.id);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleWeekday(day.id)}
                      className={`py-3 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                        isChecked
                          ? "bg-black text-white shadow-sm ring-2 ring-black"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span>{day.label}</span>
                      {isChecked && <Check size={12} className="text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-500">Rides will only be posted on the highlighted days.</p>
            </div>
          )}
        </div>
      )}

      {/* Recurrence Summary Box */}
      <div className="p-5 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Schedule Summary</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-semibold text-xs">
            {formatRecurrenceLabel(
              rideData.recurrence_type,
              rideData.selected_weekdays,
              rideData.working_days,
              rideData.off_days
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-gray-400 font-medium">From</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {rideData.start_date
                ? rideData.start_date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : rideData.travel_date
                ? rideData.travel_date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 font-medium">Until</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {rideData.recurrence_type === "ONCE"
                ? "Same Day"
                : rideData.end_date
                ? rideData.end_date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 font-medium">Departure</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {rideData.travel_time
                ? rideData.travel_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Next Step"}
            </p>
          </div>

          <div>
            <p className="text-emerald-400 font-medium">Expected Rides</p>
            <p className="text-emerald-300 font-bold text-base mt-0.5">
              {projectedDates.length} {projectedDates.length === 1 ? "Ride" : "Rides"}
            </p>
          </div>
        </div>

        {projectedDates.length > 0 && rideData.recurrence_type !== "ONCE" && (
          <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-400">
            <span>First ride on: </span>
            <strong className="text-white">
              {projectedDates[0].toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </strong>
            {projectedDates.length > 1 && (
              <>
                <span> • Last ride on: </span>
                <strong className="text-white">
                  {projectedDates[projectedDates.length - 1].toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </strong>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateSelectionStep;