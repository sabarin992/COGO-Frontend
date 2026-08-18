import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Car,
  Users,
  ShieldCheck,
} from "lucide-react";

const RideSearchCard = ({ ride, seatRequired }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(`${ride.travel_date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const formattedTime = new Date(`1970-01-01T${ride.travel_time}`).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

  const handleViewRide = () => {
    navigate(`/ride/${ride.ride_id}/details`, {
      state: {
        seatRequired,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Route Journey Header */}
      <div className="mb-5 pb-4 border-b border-gray-100">
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
          <p className="text-xs text-gray-400 mt-1 font-medium pl-4">
            Via {ride.route}
          </p>
        )}
      </div>

      {/* Date & Time Badges */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
          <CalendarDays size={18} className="text-gray-500 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Travel Date</p>
            <p className="font-semibold text-sm text-gray-900">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
          <Clock3 size={18} className="text-gray-500 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Travel Time</p>
            <p className="font-semibold text-sm text-gray-900">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* Driver Info Section */}
      <div className="mb-5 border-t border-gray-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Driver
        </p>

        <div className="flex items-center gap-3">
          {ride.driver_profile_pic ? (
            <img
              src={ride.driver_profile_pic}
              alt={ride.driver_name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-bold text-sm">
              {ride.driver_name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm text-gray-900">{ride.driver_name}</p>
              <ShieldCheck size={15} className="text-blue-500 fill-blue-100" />
            </div>
            <p className="text-xs text-gray-500">Verified Driver</p>
          </div>
        </div>
      </div>

      {/* Vehicle Info Section */}
      <div className="mb-5 border-t border-gray-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Vehicle
        </p>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 shrink-0">
            <Car size={20} />
          </div>

          <div>
            <p className="font-semibold text-sm text-gray-900">
              {ride.vehicle_brand} {ride.vehicle_model}
            </p>
            <p className="text-xs text-gray-500">
              {ride.vehicle_type} · {ride.vehicle_color}
            </p>
          </div>
        </div>
      </div>

      {/* Footer & View Action */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
          <Users size={16} />
          <span>
            {ride.available_seats} {ride.available_seats === 1 ? "seat" : "seats"} available
          </span>
        </div>

        <button
          type="button"
          onClick={handleViewRide}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95"
        >
          <span>View Ride</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RideSearchCard;