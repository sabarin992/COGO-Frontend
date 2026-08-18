import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  MapPin,
  Users,
  ShieldCheck,
  Navigation,
  Loader2,
} from "lucide-react";
import { getRideDetails } from "../../services/rideService";

const RideDetails = ({ mode }) => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const seatRequired = location.state?.seatRequired || 1;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSearchMode = mode === "search";

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRideDetails(rideId);
        setRide(data);
      } catch (err) {
        console.error("Failed to fetch ride details:", err);
        setError(
          err?.response?.data?.detail || "Unable to load ride details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleNext = () => {
    navigate(`/ride/${rideId}/review`, {
      state: {
        seatRequired,
        ride,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="text-center p-8">
          <Loader2 size={36} className="animate-spin text-black mb-3 mx-auto" />
          <p className="text-gray-600 font-medium text-sm">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100 max-w-md">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ride) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          <span>Back to Search Results</span>
        </button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Ride Details</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review complete route, vehicle, and driver details before requesting your ride.
          </p>
        </div>

        {/* Journey Route Card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Route Overview
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs shrink-0">
                A
              </div>
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="font-semibold text-gray-900 text-base">{ride.source}</p>
              </div>
            </div>

            <ArrowRight size={20} className="hidden sm:block text-gray-400 shrink-0" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-xs shrink-0">
                B
              </div>
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="font-semibold text-gray-900 text-base">{ride.destination}</p>
              </div>
            </div>
          </div>

          {ride.route && (
            <div className="mt-5 border-t border-gray-100 pt-4 flex items-center gap-2 text-xs text-gray-600">
              <Navigation size={14} className="text-blue-500" />
              <span>Route: <strong className="text-gray-900">{ride.route}</strong></span>
            </div>
          )}
        </div>

        {/* Date, Time & Seats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
              <CalendarDays size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Travel Date</p>
              <p className="font-semibold text-gray-900 text-sm">{formatDate(ride.travel_date)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
              <Clock3 size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Travel Time</p>
              <p className="font-semibold text-gray-900 text-sm">{formatTime(ride.travel_time)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
              <Users size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Available Seats</p>
              <p className="font-semibold text-gray-900 text-sm">{ride.available_seats} remaining</p>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Driver
          </p>

          <div className="flex items-center gap-4">
            {ride.driver?.profile_pic ? (
              <img
                src={ride.driver.profile_pic}
                alt={ride.driver.full_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white text-xl font-semibold">
                {ride.driver?.full_name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{ride.driver?.full_name}</h3>
                <ShieldCheck size={18} className="text-blue-500 fill-blue-100" />
              </div>
              <p className="text-sm text-gray-500">Ride Driver</p>
            </div>
          </div>
        </div>

        {/* Vehicle Card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
              <Car size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Vehicle
              </p>
              <h3 className="font-semibold text-gray-900">
                {ride.vehicle?.brand} {ride.vehicle?.model}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="mt-1 font-medium text-gray-900 text-sm">{ride.vehicle?.vehicle_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Year</p>
              <p className="mt-1 font-medium text-gray-900 text-sm">{ride.vehicle?.year}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Color</p>
              <p className="mt-1 font-medium text-gray-900 text-sm">{ride.vehicle?.color}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Registration</p>
              <p className="mt-1 font-medium text-gray-900 text-sm">{ride.vehicle?.registration_number}</p>
            </div>
          </div>
        </div>

        {/* Passengers List */}
        {ride.passengers && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Passengers
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  Passengers on this ride
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <Users size={18} />
                {ride.passengers.length} Joined
              </div>
            </div>

            {ride.passengers.length === 0 ? (
              <p className="text-sm text-gray-500">No passengers have joined this ride yet.</p>
            ) : (
              <div className="space-y-3">
                {ride.passengers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      {p.profile_pic ? (
                        <img src={p.profile_pic} alt={p.full_name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                          {p.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{p.full_name}</p>
                        <p className="text-xs text-gray-500">Passenger</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {p.seats_requested} {p.seats_requested === 1 ? "seat" : "seats"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected seats + Next */}
        {isSearchMode && (
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Your Request
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {seatRequired} {seatRequired === 1 ? "seat" : "seats"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800 shadow-sm"
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
