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
  Plus,
  Minus,
  Play,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  getRideDetails,
  startRide,
  reachedPickup,
  completeRide,
  pickupPassenger,
} from "../../services/rideService";
import { toast } from "react-toastify";

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

const RideDetails = ({ mode }) => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialSeats = location.state?.seatRequired || 1;
  const [selectedSeats, setSelectedSeats] = useState(initialSeats);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionProcessing, setActionProcessing] = useState(false);
  const [pickupProcessingId, setPickupProcessingId] = useState(null);

  const isSearchMode = mode === "search";
  const isMyRideMode = mode === "my-ride";

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRideDetails(rideId);
        setRide(data);

        // Adjust selectedSeats if initial value exceeds available seats
        if (data && data.available_seats) {
          setSelectedSeats((prev) => Math.min(Math.max(1, prev), data.available_seats));
        }
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

  const handleStartRide = async () => {
    if (actionProcessing || !ride) return;
    try {
      setActionProcessing(true);
      const updated = await startRide(ride.ride_id);
      setRide((prev) => ({
        ...prev,
        ...updated,
        status: updated.status,
      }));
      toast.success("Ride started successfully!");
    } catch (err) {
      console.error("Failed to start ride:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Failed to start ride.";
      toast.error(errorMsg);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleReachedPickup = async () => {
    if (actionProcessing || !ride) return;
    try {
      setActionProcessing(true);
      const updated = await reachedPickup(ride.ride_id);
      setRide((prev) => ({
        ...prev,
        ...updated,
        status: updated.status,
      }));
      toast.success("Reached pickup point successfully!");
    } catch (err) {
      console.error("Failed to mark pickup reached:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Failed to mark pickup point reached.";
      toast.error(errorMsg);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleCompleteRide = async () => {
    if (actionProcessing || !ride) return;
    try {
      setActionProcessing(true);
      const updated = await completeRide(ride.ride_id);
      setRide((prev) => ({
        ...prev,
        ...updated,
        status: updated.status,
      }));
      toast.success("Ride completed successfully!");
    } catch (err) {
      console.error("Failed to complete ride:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Failed to complete ride.";
      toast.error(errorMsg);
    } finally {
      setActionProcessing(false);
    }
  };

  const handlePickupPassenger = async (passenger) => {
    if (!ride || !passenger?.ride_request_id || pickupProcessingId || actionProcessing) return;

    try {
      setPickupProcessingId(passenger.ride_request_id);

      const updatedRequest = await pickupPassenger(ride.ride_id, passenger.ride_request_id);

      // Update local ride state: passenger status -> picked_up and ride status -> ONGOING
      setRide((prev) => {
        if (!prev) return prev;

        const updatedPassengers = (prev.passengers || []).map((p) =>
          p.ride_request_id === passenger.ride_request_id
            ? { ...p, status: "picked_up" }
            : p
        );

        const updatedRideStatus = updatedRequest.ride_status || prev.status;

        return {
          ...prev,
          status: updatedRideStatus,
          passengers: updatedPassengers,
        };
      });

      toast.success(`Picked up ${passenger.full_name || "passenger"} successfully!`);
    } catch (err) {
      console.error("Failed to pick up passenger:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Failed to pick up passenger.";
      toast.error(errorMsg);
    } finally {
      setPickupProcessingId(null);
    }
  };

  const handleDecrementSeats = () => {
    setSelectedSeats((prev) => Math.max(1, prev - 1));
  };

  const handleIncrementSeats = () => {
    if (!ride) return;
    const maxAvailable = ride.available_seats || 1;
    setSelectedSeats((prev) => Math.min(maxAvailable, prev + 1));
  };

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
        seatRequired: selectedSeats,
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
            onClick={() => (isMyRideMode ? navigate("/profile/my-rides") : navigate("/ride/search"))}
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
          onClick={() => (isMyRideMode ? navigate("/profile/my-rides") : navigate("/ride/search"))}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          <span>{isMyRideMode ? "Back to My Posted Rides" : "Back to Search Results"}</span>
        </button>

        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-gray-900">Ride Details</h1>
              {ride.status && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeStyle(
                    ride.status
                  )}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current"></span>
                  {ride.status.replace("_", " ")}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {isMyRideMode
                ? "Manage and review complete details, route, vehicle, and joined passengers for your posted ride."
                : "Review complete route, vehicle, and driver details before requesting your ride."}
            </p>
          </div>
        </div>

        {/* Rider Lifecycle Control Panel (My Ride Mode Only) */}
        {isMyRideMode && ride.status && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ride Lifecycle Action
            </p>

            {ride.status === "CREATED" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-200 text-slate-700 rounded-lg shrink-0 mt-0.5">
                    <Info size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Ride Created</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Waiting for passenger requests to be accepted. Once accepted, your ride will become UPCOMING and ready to start.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ride.status === "UPCOMING" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-200 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                    <Play size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 text-sm">Ride Ready to Start</h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      You have accepted passenger request(s). Click "Start Ride" when you begin travelling towards the pickup point.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={actionProcessing}
                  onClick={handleStartRide}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {actionProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} className="fill-current" />
                  )}
                  <span>{actionProcessing ? "Starting..." : "Start Ride"}</span>
                </button>
              </div>
            )}

            {ride.status === "STARTED" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-200 text-amber-800 rounded-lg shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950 text-sm">Ride En Route to Pickup Point</h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      You are travelling towards the passenger pickup point. Click "Reached Pickup Point" when you arrive.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={actionProcessing}
                  onClick={handleReachedPickup}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-800 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {actionProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <MapPin size={16} />
                  )}
                  <span>{actionProcessing ? "Updating..." : "Reached Pickup Point"}</span>
                </button>
              </div>
            )}

            {ride.status === "REACHED_PICKUP" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50 border border-purple-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-200 text-purple-800 rounded-lg shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-950 text-sm">Reached Pickup Location</h3>
                    <p className="text-xs text-purple-800 mt-0.5">
                      You have reached the pickup point. Pick up passengers below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ride.status === "ONGOING" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-200 text-blue-800 rounded-lg shrink-0 mt-0.5">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950 text-sm">Ride Ongoing — Travelling to Destination</h3>
                    <p className="text-xs text-blue-800 mt-0.5">
                      The ride is in progress toward the final destination. Click "Complete Ride" when you arrive at the destination.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={actionProcessing}
                  onClick={handleCompleteRide}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {actionProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  <span>{actionProcessing ? "Completing..." : "Complete Ride"}</span>
                </button>
              </div>
            )}

            {ride.status === "COMPLETED" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-50 border border-teal-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-200 text-teal-800 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-teal-950 text-sm">Ride Completed</h3>
                    <p className="text-xs text-teal-800 mt-0.5">
                      This ride has reached its final destination and is completed. Thank you for driving safely!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ride.status === "CANCELLED" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50 border border-rose-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-200 text-rose-800 rounded-lg shrink-0 mt-0.5">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-950 text-sm">Ride Cancelled</h3>
                    <p className="text-xs text-rose-800 mt-0.5">
                      This ride has been cancelled and is inactive.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
                {ride.passengers.map((p) => {
                  const canPickup =
                    isMyRideMode &&
                    (ride.status === "REACHED_PICKUP" || ride.status === "ONGOING") &&
                    p.status === "accepted";
                  const isPickedUp = p.status === "picked_up";
                  const isThisPickupProcessing = pickupProcessingId === p.ride_request_id;

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-gray-50 p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        {p.profile_pic ? (
                          <img
                            src={p.profile_pic}
                            alt={p.full_name}
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600 shrink-0">
                            {p.full_name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm">{p.full_name}</p>
                            {isPickedUp && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                                <CheckCircle2 size={12} />
                                Picked Up
                              </span>
                            )}
                            {p.status === "accepted" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                Accepted
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {p.seats_requested} {p.seats_requested === 1 ? "seat" : "seats"} requested
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {canPickup && (
                          <button
                            type="button"
                            disabled={Boolean(pickupProcessingId) || actionProcessing}
                            onClick={() => handlePickupPassenger(p)}
                            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shrink-0"
                          >
                            {isThisPickupProcessing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            <span>{isThisPickupProcessing ? "Picking Up..." : "Pick Up Passenger"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected seats counter + Book Button */}
        {isSearchMode && (
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Seats Required
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                Max available: {ride.available_seats} {ride.available_seats === 1 ? "seat" : "seats"}
              </p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Interactive Counter Controls */}
              <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1.5 border border-gray-200">
                <button
                  type="button"
                  disabled={selectedSeats <= 1}
                  onClick={handleDecrementSeats}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Decrease seats"
                >
                  <Minus size={16} />
                </button>

                <span className="w-8 text-center text-sm font-bold text-gray-900">
                  {selectedSeats}
                </span>

                <button
                  type="button"
                  disabled={selectedSeats >= (ride.available_seats || 1)}
                  onClick={handleIncrementSeats}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Increase seats"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Book Action Button */}
              <button
                type="button"
                disabled={ride.available_seats <= 0}
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800 shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
              >
                <span>Book ({selectedSeats} {selectedSeats === 1 ? "Seat" : "Seats"})</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
