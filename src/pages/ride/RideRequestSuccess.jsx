import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Search, Home, ArrowRight, MapPin, CalendarDays, Clock3, Users } from "lucide-react";

const RideRequestSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ride = location.state?.ride;
  const request = location.state?.request;

  const formattedDate = ride?.travel_date
    ? new Date(`${ride.travel_date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const formattedTime = ride?.travel_time
    ? new Date(`1970-01-01T${ride.travel_time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={36} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          Ride Request Submitted!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your request has been sent to the driver for approval.
        </p>

        {/* Status Badge */}
        <div className="my-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Status: PENDING DRIVER APPROVAL</span>
        </div>

        {/* Ride Details Summary */}
        {ride && (
          <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 text-left space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Route</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {ride.source} <ArrowRight size={14} className="inline mx-1 text-gray-400" /> {ride.destination}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200/60 pt-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-gray-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-xs text-gray-900">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} className="text-gray-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-xs text-gray-900">{formattedTime}</p>
                </div>
              </div>
            </div>

            {request && (
              <div className="flex items-center gap-2 border-t border-gray-200/60 pt-3">
                <Users size={16} className="text-gray-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Seats Requested</p>
                  <p className="font-medium text-xs text-gray-900">
                    {request.seats_requested || 1} {request.seats_requested === 1 ? "seat" : "seats"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/ride/search")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Search size={16} />
            Search Another Ride
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            <Home size={16} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideRequestSuccess;