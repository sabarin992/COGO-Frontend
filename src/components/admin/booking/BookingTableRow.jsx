import React from "react";
import { Eye, Ban, MapPin, Calendar, Clock, User, ArrowRight } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  } catch (e) {
    return dateStr;
  }
};

const formatBookingDate = (dtStr) => {
  if (!dtStr) return "N/A";
  try {
    const d = new Date(dtStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dtStr;
  }
};

const BookingTableRow = ({
  booking,
  isSelected,
  onView,
  onCancel,
}) => {
  const normStatus = (booking.status || "").toLowerCase();
  const isCancellable = normStatus !== "cancelled" && normStatus !== "rejected";

  return (
    <tr
      onClick={() => onView && onView(booking)}
      className={`cursor-pointer transition-colors border-b border-gray-100 ${
        isSelected ? "bg-gray-100/90 font-medium" : "hover:bg-gray-50"
      }`}
    >
      {/* Booking ID */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
          #BK-{String(booking.booking_id).padStart(4, "0")}
        </span>
      </td>

      {/* Passenger */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {booking.passenger_profile_pic ? (
            <img
              src={booking.passenger_profile_pic}
              alt={booking.passenger_name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {booking.passenger_name
                ? booking.passenger_name.slice(0, 2).toUpperCase()
                : "PA"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {booking.passenger_name || "Unknown"}
            </p>
            {booking.passenger_email && (
              <p className="text-xs text-gray-500 truncate max-w-[140px]">
                {booking.passenger_email}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Driver */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {booking.driver_profile_pic ? (
            <img
              src={booking.driver_profile_pic}
              alt={booking.driver_name}
              className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold text-[10px] flex items-center justify-center shrink-0">
              {booking.driver_name
                ? booking.driver_name.slice(0, 2).toUpperCase()
                : "DR"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">
              {booking.driver_name || "Unknown"}
            </p>
            <p className="text-[10px] text-gray-400 font-mono">
              Ride #RD-{booking.ride_id}
            </p>
          </div>
        </div>
      </td>

      {/* Route */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 max-w-[180px] text-xs font-medium text-gray-800">
          <span className="truncate" title={booking.source}>
            {booking.source}
          </span>
          <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="truncate" title={booking.destination}>
            {booking.destination}
          </span>
        </div>
      </td>

      {/* Travel Date */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-xs text-gray-700">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{formatDate(booking.travel_date)}</span>
        </div>
      </td>

      {/* Seats Requested */}
      <td className="px-5 py-4 text-center">
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
          {booking.seats_requested}
        </span>
      </td>

      {/* Booking Date */}
      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
        {formatBookingDate(booking.created_at)}
      </td>

      {/* Status */}
      <td className="px-5 py-4 whitespace-nowrap">
        <BookingStatusBadge status={booking.status} />
      </td>

      {/* Actions */}
      <td className="px-5 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onView && onView(booking)}
            title="View Booking Details"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>

          {isCancellable && (
            <button
              type="button"
              onClick={() => onCancel && onCancel(booking)}
              title="Cancel Booking"
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

export default BookingTableRow;

