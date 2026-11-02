import { useMemo } from "react";
import { useRide } from "../../context/RideContext";
import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Users,
  Car,
  CheckCircle2,
  Repeat,
  Sparkles,
} from "lucide-react";
import {
  calculateProjectedDates,
  formatRecurrenceLabel,
} from "../../utils/recurrenceUtils";

const ReviewRideStep = () => {
  const { rideData } = useRide();

  const formattedDate = useMemo(() => {
    if (!rideData.travel_date && !rideData.start_date) return "-";
    const d = rideData.travel_date || rideData.start_date;
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [rideData.travel_date, rideData.start_date]);

  const formattedEndDate = useMemo(() => {
    if (!rideData.end_date) return "-";
    return rideData.end_date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [rideData.end_date]);

  const formattedTime = useMemo(() => {
    if (!rideData.travel_time) return "-";
    return rideData.travel_time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [rideData.travel_time]);

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

  const isRecurring = rideData.recurrence_type && rideData.recurrence_type !== "ONCE";

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Ride</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Please verify all details before publishing your ride{isRecurring ? "s" : ""} to passengers.
        </p>
      </div>

      {/* Journey Pathway Card */}
      <div className="mb-6 p-5 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-md">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Journey Route
        </div>

        <div className="relative pl-6 space-y-6">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-gray-700" />

          {/* Source */}
          <div className="relative flex items-start gap-3">
            <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-gray-900" />
            <div>
              <span className="text-xs text-gray-400 font-medium">Starting Point</span>
              <p className="text-base font-semibold text-white">{rideData.source || "-"}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="relative flex items-start gap-3">
            <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-gray-900" />
            <div>
              <span className="text-xs text-gray-400 font-medium">Destination</span>
              <p className="text-base font-semibold text-white">{rideData.destination || "-"}</p>
            </div>
          </div>
        </div>

        {/* Selected Highway Route Badge */}
        {rideData.route && (
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-xs text-gray-300">
            <Navigation size={14} className="text-blue-400" />
            <span>Route: <strong className="text-white">{rideData.route}</strong></span>
          </div>
        )}
      </div>

      {/* Recurrence Banner if recurring */}
      {isRecurring && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Repeat size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800">Recurring Schedule</p>
              <p className="font-bold text-emerald-950 text-sm">
                {formatRecurrenceLabel(
                  rideData.recurrence_type,
                  rideData.selected_weekdays,
                  rideData.working_days,
                  rideData.off_days
                )}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-emerald-700">Rides Generated</span>
            <p className="text-lg font-extrabold text-emerald-900">{projectedDates.length} Rides</p>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Travel Date / Date Range */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">
              {isRecurring ? "Recurrence Window" : "Travel Date"}
            </span>
            <p className="font-semibold text-gray-900 text-sm">
              {isRecurring ? `${formattedDate} to ${formattedEndDate}` : formattedDate}
            </p>
          </div>
        </div>

        {/* Departure Time */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Departure Time</span>
            <p className="font-semibold text-gray-900 text-sm">{formattedTime}</p>
          </div>
        </div>

        {/* Available Seats */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Available Seats</span>
            <p className="font-semibold text-gray-900 text-sm">
              {rideData.available_seats} {rideData.available_seats === 1 ? "seat" : "seats"} (per ride)
            </p>
          </div>
        </div>

        {/* Vehicle */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Car size={20} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Vehicle</span>
            <p className="font-semibold text-gray-900 text-sm">
              {rideData.vehicle
                ? `${rideData.vehicle.brand} ${rideData.vehicle.model} (${rideData.vehicle.registration_number || rideData.vehicle.license_plate || ""})`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 text-xs font-medium flex items-center gap-3">
        <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
        <span>
          All details verified. Click <strong>{isRecurring ? `Publish ${projectedDates.length} Rides` : "Publish Ride"}</strong> below to offer your ride to passengers!
        </span>
      </div>
    </div>
  );
};

export default ReviewRideStep;
