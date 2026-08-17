import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  ArrowRight,
  Car,
} from "lucide-react";

const RideSuccess = () => {
  console.log('Ride Success');
  
  const navigate = useNavigate();
  const location = useLocation();

  const ride = location.state?.ride;

  // Handle direct access to success page without ride data
  if (!ride) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <MapPin size={32} className="text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Ride information not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            The ride information is no longer available on this page.
            Please check your rides to view your published ride.
          </p>

          <button
            type="button"
            onClick={() => navigate("/ride/my-rides")}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View My Rides
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = ride.travel_date
    ? new Date(`${ride.travel_date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Not available";

  const formattedTime = ride.travel_time
    ? new Date(`1970-01-01T${ride.travel_time}`).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "Not available";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Success Message */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              size={36}
              className="text-green-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Ride Published Successfully!
          </h1>

          <p className="mx-auto mt-2 max-w-md text-gray-600">
            Your ride has been published successfully. Other users can now
            find your ride and send ride requests.
          </p>

          {/* Status */}
          <div className="mx-auto mt-6 inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            Ride Status: Published
          </div>
        </div>

        {/* Ride Summary */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Ride Summary
          </p>

          {/* Route */}
          <div className="flex items-center gap-3">
            <MapPin
              size={20}
              className="shrink-0 text-gray-500"
            />

            <div className="flex flex-wrap items-center gap-3 font-semibold text-gray-900">
              <span>{ride.source}</span>

              <ArrowRight
                size={18}
                className="text-gray-400"
              />

              <span>{ride.destination}</span>
            </div>
          </div>

          {/* Ride Details */}
          <div className="mt-5 grid grid-cols-1 gap-5 border-t border-gray-100 pt-5 sm:grid-cols-3">

            {/* Date */}
            <div className="flex items-center gap-3">
              <CalendarDays
                size={18}
                className="shrink-0 text-gray-500"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Date
                </p>

                <p className="text-sm font-medium text-gray-900">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <Clock3
                size={18}
                className="shrink-0 text-gray-500"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Departure
                </p>

                <p className="text-sm font-medium text-gray-900">
                  {formattedTime}
                </p>
              </div>
            </div>

            {/* Seats */}
            <div className="flex items-center gap-3">
              <Users
                size={18}
                className="shrink-0 text-gray-500"
              />

              <div>
                <p className="text-xs text-gray-500">
                  Available Seats
                </p>

                <p className="text-sm font-medium text-gray-900">
                  {ride.available_seats}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
            <Car
              size={18}
              className="shrink-0 text-gray-500"
            />

            <div>
              <p className="text-xs text-gray-500">
                Vehicle
              </p>

              <p className="text-sm font-medium text-gray-900">
                {ride.vehicle?.vehicle_name ||
                  ride.vehicle?.name ||
                  `Vehicle #${ride.vehicle_id}`}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">

          {/* Home */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Go Home
          </button>

          {/* My Rides */}
          <button
            type="button"
            onClick={() => navigate("/ride/my-rides")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            View My Rides
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideSuccess;