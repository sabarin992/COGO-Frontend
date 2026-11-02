import React from "react";
import { Eye, Ban, MapPin, Calendar, Clock, User } from "lucide-react";
import RideStatusBadge from "../../ride/RideStatusBadge";

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  try {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  } catch (e) {
    return timeStr;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const RideTableRow = ({
  ride,
  isSelected,
  onView,
  onCancel,
}) => {
  const isCancellable =
    ride.status !== "COMPLETED" && ride.status !== "CANCELLED";

  return (
    <tr
      onClick={() => onView && onView(ride)}
      className={`cursor-pointer transition-colors border-b border-gray-100 ${
        isSelected ? "bg-gray-100/90 font-medium" : "hover:bg-gray-50"
      }`}
    >
      {/* Ride ID */}
      <td className="px-5 py-4">
        <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
          #RD-{String(ride.ride_id).padStart(4, "0")}
        </span>
      </td>

      {/* Driver */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {ride.driver_profile_pic ? (
            <img
              src={ride.driver_profile_pic}
              alt={ride.driver_name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {ride.driver_name ? ride.driver_name.slice(0, 2).toUpperCase() : "DR"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {ride.driver_name || "Unknown"}
            </p>
            {ride.driver_email && (
              <p className="text-xs text-gray-500 truncate max-w-[160px]">
                {ride.driver_email}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Source */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 max-w-[180px]">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-sm text-gray-800 truncate" title={ride.source}>
            {ride.source}
          </span>
        </div>
      </td>

      {/* Destination */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 max-w-[180px]">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="text-sm text-gray-800 truncate" title={ride.destination}>
            {ride.destination}
          </span>
        </div>
      </td>

      {/* Travel Date */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {formatDate(ride.travel_date)}
        </div>
      </td>

      {/* Travel Time */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {formatTime(ride.travel_time)}
        </div>
      </td>

      {/* Available Seats */}
      <td className="px-5 py-4 text-center">
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
          {ride.available_seats}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4 whitespace-nowrap">
        <RideStatusBadge status={ride.status} />
      </td>

      {/* Actions */}
      <td className="px-5 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onView && onView(ride)}
            title="View Ride Details"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>

          {isCancellable && (
            <button
              type="button"
              onClick={() => onCancel && onCancel(ride)}
              title="Cancel Ride"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RideTableRow;

