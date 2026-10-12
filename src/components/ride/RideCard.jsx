import React from "react";
import { MapPin, CalendarDays, Clock3, Users, Eye, Trash2, ArrowRight, Inbox, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "CREATED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "UPCOMING":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "STARTED":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "REACHED_PICKUP":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "ONGOING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-teal-50 text-teal-700 border-teal-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const RideCard = ({ ride, onView, onDelete }) => {
  const navigate = useNavigate();

  const formattedDate = ride.travel_date
    ? new Date(`${ride.travel_date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const formattedTime = ride.travel_time
    ? new Date(`1970-01-01T${ride.travel_time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Route Header */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Route</span>
            {ride.status && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadgeStyle(ride.status)}`}>
                {ride.status.replace("_", " ")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>{ride.source}</span>
            </div>

            <ArrowRight size={18} className="text-gray-400 shrink-0" />

            <div className="flex items-center gap-2 text-red-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>{ride.destination}</span>
            </div>
          </div>

          {ride.route && (
            <p className="text-xs text-gray-500 mt-1 font-medium pl-4 flex items-center gap-1">
              <Navigation size={12} className="text-blue-500" />
              <span>Via {ride.route}</span>
            </p>
          )}
        </div>

        {/* Date & Time Badges */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <CalendarDays size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Date</p>
              <p className="font-semibold text-xs text-gray-900">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Clock3 size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Departure</p>
              <p className="font-semibold text-xs text-gray-900">{formattedTime}</p>
            </div>
          </div>
        </div>

        {/* Seats Info */}
        <div className="mb-4 flex items-center justify-between bg-purple-50/60 p-3 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
            <Users size={16} />
            <span>Available Seats</span>
          </div>
          <span className="text-xs font-bold text-purple-800 px-2 py-0.5 rounded bg-purple-100">
            {ride.available_seats} {ride.available_seats === 1 ? "Seat" : "Seats"} Left
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-100 pt-4 mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onView(ride)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95"
        >
          <Eye size={15} />
          <span>Details</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/profile/ride-requests?rideId=${ride.ride_id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-100"
        >
          <Inbox size={15} />
          <span>Requests</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(ride)}
          className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
          title="Delete Ride"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default RideCard;
