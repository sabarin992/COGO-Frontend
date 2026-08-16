import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Car,
  Users,
} from "lucide-react";

const RideSearchCard = ({ ride, seatRequired }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(
    `${ride.travel_date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(
    `1970-01-01T${ride.travel_time}`
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

 const handleViewRide = () => {
  navigate(`/ride/${ride.ride_id}/details`, {
    state: {
      seatRequired,
    },
  });
};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* Route */}
      <div className="mb-5">
        <div className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <span>{ride.source}</span>

          <ArrowRight
            size={20}
            className="text-gray-400"
          />

          <span>{ride.destination}</span>
        </div>
      </div>

      {/* Date & Time */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <CalendarDays size={18} className="text-gray-500" />

          <div>
            <p className="text-xs text-gray-500">
              Travel Date
            </p>

            <p className="font-medium text-gray-900">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <Clock3 size={18} className="text-gray-500" />

          <div>
            <p className="text-xs text-gray-500">
              Travel Time
            </p>

            <p className="font-medium text-gray-900">
              {formattedTime}
            </p>
          </div>
        </div>

      </div>

      {/* Driver */}
      <div className="mb-5 border-t border-gray-100 pt-5">

        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          Driver
        </p>

        <div className="flex items-center gap-3">

          {ride.driver_profile_pic ? (
            <img
              src={ride.driver_profile_pic}
              alt={ride.driver_name}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
              {ride.driver_name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div>
            <p className="font-medium text-gray-900">
              {ride.driver_name}
            </p>

            <p className="text-sm text-gray-500">
              Driver
            </p>
          </div>

        </div>
      </div>

      {/* Vehicle */}
      <div className="mb-5 border-t border-gray-100 pt-5">

        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          Vehicle
        </p>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Car size={20} className="text-gray-600" />
          </div>

          <div>
            <p className="font-medium text-gray-900">
              {ride.vehicle_brand} {ride.vehicle_model}
            </p>

            <p className="text-sm text-gray-500">
              {ride.vehicle_type} · {ride.vehicle_color}
            </p>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-5">

        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users size={18} />

          <span>
            {ride.available_seats}{" "}
            {ride.available_seats === 1 ? "seat" : "seats"}{" "}
            available
          </span>
        </div>

        <button
          type="button"
          onClick={handleViewRide}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          View Ride
          <ArrowRight size={16} />
        </button>

      </div>

    </div>
  );
};

export default RideSearchCard;