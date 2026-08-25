import React, { useState } from "react";
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
  Loader2,
} from "lucide-react";
import { requestRide } from "../../services/rideService";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

const RideReview = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const ride = location.state?.ride;
  const seatRequired = location.state?.seatRequired || 1;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBack = () => {
    navigate(`/ride/${rideId}/details`, {
      state: {
        seatRequired,
      },
    });
  };

  const handleRequestRide = async () => {
    try {
      setLoading(true);
      setError("");

      const requestData = {
        ride_id: Number(rideId),
        seats_requested: seatRequired,
      };

      const response = await requestRide(requestData);

      toast.success("Ride request submitted successfully!");

      navigate("/ride/request-success", {
        state: {
          ride,
          request: response,
        },
      });
    } catch (err) {
      console.error("Ride request failed:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.detail || "Unable to request this ride. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRequest = async () => {
    setShowConfirmModal(false);
    await handleRequestRide();
  };

  if (!ride) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm max-w-md">
          <h2 className="text-xl font-semibold text-gray-900">
            Ride information not found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please go back and select the ride again.
          </p>
          <button
            type="button"
            onClick={() => navigate("/ride/search")}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Search Rides
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(`${ride.travel_date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(`1970-01-01T${ride.travel_time}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          disabled={loading}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Back to Ride Details
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Review Your Ride</h1>
          <p className="mt-2 text-gray-600">
            Please verify the ride information before sending your request.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Route */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Journey
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shrink-0">
                <MapPin size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="font-semibold text-gray-900">{ride.source}</p>
              </div>
            </div>

            <ArrowRight size={20} className="hidden text-gray-400 sm:block shrink-0" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shrink-0">
                <MapPin size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="font-semibold text-gray-900">{ride.destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date / Time / Seats */}
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <CalendarDays size={20} className="mb-3 text-gray-600" />
            <p className="text-xs text-gray-500">Travel Date</p>
            <p className="mt-1 font-semibold text-gray-900">{formattedDate}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Clock3 size={20} className="mb-3 text-gray-600" />
            <p className="text-xs text-gray-500">Travel Time</p>
            <p className="mt-1 font-semibold text-gray-900">{formattedTime}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Users size={20} className="mb-3 text-gray-600" />
            <p className="text-xs text-gray-500">Seats Required</p>
            <p className="mt-1 font-semibold text-gray-900">{seatRequired}</p>
          </div>
        </div>

        {/* Driver */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Driver
          </p>

          <div className="flex items-center gap-4">
            {ride.driver?.profile_pic ? (
              <img
                src={ride.driver.profile_pic}
                alt={ride.driver.full_name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600">
                {ride.driver?.full_name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div>
              <p className="font-semibold text-gray-900">{ride.driver?.full_name}</p>
              <p className="text-sm text-gray-500">Ride Driver</p>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
              <Car size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Vehicle</p>
              <p className="font-semibold text-gray-900">
                {ride.vehicle?.brand} {ride.vehicle?.model}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="mt-1 font-medium text-gray-900">{ride.vehicle?.vehicle_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Color</p>
              <p className="mt-1 font-medium text-gray-900">{ride.vehicle?.color}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Year</p>
              <p className="mt-1 font-medium text-gray-900">{ride.vehicle?.year}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Registration</p>
              <p className="mt-1 font-medium text-gray-900">{ride.vehicle?.registration_number}</p>
            </div>
          </div>
        </div>

        {/* Request Summary */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Request Summary
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Seats required</span>
              <span className="font-semibold text-gray-900">{seatRequired}</span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-gray-600">Available seats</span>
              <span className="font-semibold text-gray-900">{ride.available_seats}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <span>Request Ride</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmRequest}
          title="Confirm Ride Request?"
          message={`Are you sure you want to request ${seatRequired} ${seatRequired === 1 ? "seat" : "seats"} for the ride from ${ride.source} to ${ride.destination}? A booking request will be sent to driver ${ride.driver?.full_name || "the host"}.`}
          confirmText={loading ? "Requesting..." : "Yes, Send Request"}
          cancelText="Cancel"
          type="primary"
        />
      </div>
    </div>
  );
};

export default RideReview;