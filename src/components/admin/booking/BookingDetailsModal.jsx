import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  Users,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Ban,
  BookmarkCheck,
} from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import RideStatusBadge from "../../ride/RideStatusBadge";

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

const formatDateTime = (dtStr) => {
  if (!dtStr) return "N/A";
  try {
    const d = new Date(dtStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dtStr;
  }
};

const BookingDetailsModal = ({
  isOpen,
  onClose,
  booking,
  loading,
  onInitiateCancel,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normStatus = (booking?.status || "").toLowerCase();
  const isCancellable =
    booking &&
    normStatus !== "cancelled" &&
    normStatus !== "rejected" &&
    booking.ride?.status !== "COMPLETED";

  const handleNavigateToRide = () => {
    if (booking?.ride?.ride_id) {
      onClose();
      navigate("/admin/rides");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Booking Details
                </h3>
                {booking && (
                  <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    #BK-{String(booking.booking_id).padStart(4, "0")}
                  </span>
                )}
                {booking && <BookingStatusBadge status={booking.status} size="sm" />}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Full verification of passenger booking request, assigned driver and ride
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-black transition-colors rounded-lg p-1.5 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading || !booking ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 font-medium">
                Fetching booking details...
              </p>
            </div>
          ) : (
            <>
              {/* Cancellation Banner */}
              {booking.status === "cancelled" && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-rose-900">
                      This booking has been cancelled
                    </p>
                    {booking.cancellation_reason && (
                      <p className="text-xs text-rose-800">
                        <span className="font-semibold">Reason:</span>{" "}
                        {booking.cancellation_reason}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-rose-600 pt-1">
                      {booking.cancelled_by_admin && (
                        <span>By Admin: {booking.cancelled_by_admin}</span>
                      )}
                      {booking.cancelled_at && (
                        <span>At: {formatDateTime(booking.cancelled_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Overview Card */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Request Information
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-[11px] font-medium text-gray-400">
                      Booking Status
                    </span>
                    <div className="mt-1">
                      <BookingStatusBadge status={booking.status} size="sm" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-gray-400">
                      Seats Requested
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {booking.seats_requested} {booking.seats_requested === 1 ? "seat" : "seats"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-gray-400">
                      Booking Date
                    </span>
                    <p className="text-xs font-semibold text-gray-800 mt-1">
                      {formatDateTime(booking.created_at)}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-gray-400">
                      Last Updated
                    </span>
                    <p className="text-xs font-semibold text-gray-800 mt-1">
                      {formatDateTime(booking.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger & Driver Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Passenger Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Passenger Information
                    </h4>
                    <span className="text-xs font-mono text-gray-400">
                      ID #{booking.passenger?.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    {booking.passenger?.profile_pic ? (
                      <img
                        src={booking.passenger.profile_pic}
                        alt={booking.passenger.full_name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {booking.passenger?.full_name
                          ? booking.passenger.full_name.slice(0, 2).toUpperCase()
                          : "PA"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {booking.passenger?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ride Consumer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.passenger?.email || "No email available"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{booking.passenger?.phone || "No phone available"}</span>
                    </div>
                  </div>
                </div>

                {/* Driver Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Driver Information
                    </h4>
                    <span className="text-xs font-mono text-gray-400">
                      ID #{booking.driver?.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    {booking.driver?.profile_pic ? (
                      <img
                        src={booking.driver.profile_pic}
                        alt={booking.driver.full_name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {booking.driver?.full_name
                          ? booking.driver.full_name.slice(0, 2).toUpperCase()
                          : "DR"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {booking.driver?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Verified Ride Host
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.driver?.email || "No email available"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{booking.driver?.phone || "No phone available"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Associated Ride & Vehicle Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Associated Ride Details
                    </h4>
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      #RD-{booking.ride?.ride_id}
                    </span>
                    {booking.ride && (
                      <RideStatusBadge status={booking.ride.status} size="sm" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNavigateToRide}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                  >
                    View in Rides
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Route & Schedule */}
                  <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                      <span>{booking.ride?.source}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span>{booking.ride?.destination}</span>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(booking.ride?.travel_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {formatTime(booking.ride?.travel_time)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      Available Seats on Ride: <span className="font-bold text-gray-800">{booking.ride?.available_seats}</span>
                    </p>
                  </div>

                  {/* Vehicle Details */}
                  {booking.vehicle && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-gray-900">
                          {booking.vehicle.brand} {booking.vehicle.model}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {booking.vehicle.vehicle_type} &bull; {booking.vehicle.color || "Standard"}
                      </p>
                      <p className="font-mono font-bold text-gray-800 pt-1">
                        Plate: {booking.vehicle.registration_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            {booking && isCancellable && (
              <button
                type="button"
                onClick={() => onInitiateCancel && onInitiateCancel(booking)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <Ban className="w-4 h-4" />
                Cancel Booking
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;

