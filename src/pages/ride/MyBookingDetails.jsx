import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
  User,
  ShieldCheck,
  Loader2,
  Navigation,
} from "lucide-react";
import {
  getSingleRideRequestDetails,
  cancelRideRequest,
} from "../../services/rideService";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";

const MyBookingDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processing, setProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSingleRideRequestDetails(requestId);
      setBooking(data);
    } catch (err) {
      console.error("Failed to fetch booking details:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Unable to load booking details.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchDetails();
    }
  }, [requestId]);

  const handleConfirmCancel = async () => {
    if (!booking) return;

    try {
      setProcessing(true);
      const updated = await cancelRideRequest(booking.ride_request_id);
      setBooking((prev) => ({
        ...prev,
        status: updated.status,
      }));
      toast.info("Booking cancelled successfully.");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to cancel booking."
      );
    } finally {
      setProcessing(false);
      setShowCancelModal(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCreatedTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white p-8 border border-gray-100 shadow-sm">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-black mb-3 mx-auto" />
          <p className="text-sm font-medium text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center shadow-sm max-w-md mx-auto">
        <p className="text-sm font-semibold text-red-600 mb-4">{error || "Booking not found."}</p>
        <button
          type="button"
          onClick={() => navigate("/profile/my-bookings")}
          className="rounded-xl bg-black px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition"
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  const isCanCancel =
    booking.status?.toLowerCase() === "pending" ||
    booking.status?.toLowerCase() === "accepted";

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate("/profile/my-bookings")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        <span>Back to My Bookings</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review ride and driver details for your requested booking.
          </p>
        </div>

        <span
          className={`self-start sm:self-auto inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold border ${getStatusBadge(
            booking.status
          )}`}
        >
          {booking.status?.toUpperCase()}
        </span>
      </div>

      {/* Ride Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Ride Information
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs shrink-0">
              A
            </div>
            <div>
              <p className="text-xs text-gray-500">Source</p>
              <p className="font-semibold text-gray-900 text-base">{booking.source || "N/A"}</p>
            </div>
          </div>

          <span className="hidden sm:block text-gray-300 font-bold text-xl">→</span>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-xs shrink-0">
              B
            </div>
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <p className="font-semibold text-gray-900 text-base">{booking.destination || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Calendar size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Travel Date</p>
              <p className="font-semibold text-xs text-gray-900">{formatDate(booking.travel_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Clock size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Departure Time</p>
              <p className="font-semibold text-xs text-gray-900">{formatTime(booking.travel_time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Users size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Seats Booked</p>
              <p className="font-semibold text-xs text-gray-900">{booking.seats_requested} seats</p>
            </div>
          </div>
        </div>

        {booking.route && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <Navigation size={14} className="text-blue-500" />
            <span>Route: <strong className="text-gray-900">{booking.route}</strong></span>
          </div>
        )}
      </div>

      {/* Driver Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Driver Information
        </p>

        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          {booking.driver_profile_pic ? (
            <img
              src={booking.driver_profile_pic}
              alt={booking.driver_name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white font-bold text-base">
              {booking.driver_name?.charAt(0)?.toUpperCase() || "D"}
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {booking.driver_name || "Ride Driver"}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <User size={14} />
              Ride Host
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 border border-gray-100">
            <Clock size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-gray-500">Booking Submitted At</p>
              <p className="font-bold text-gray-900 text-sm">
                {formatCreatedTime(booking.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 border border-gray-100">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-gray-500">Booking Status</p>
              <p className="font-bold text-gray-900 text-sm uppercase">
                {booking.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {isCanCancel && (
        <div className="flex items-center justify-end rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            disabled={processing}
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
          >
            <X size={16} />
            <span>Cancel Booking</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Ride Booking?"
        message="Are you sure you want to cancel your booking request? The driver will be notified."
        confirmText={processing ? "Processing..." : "Yes, Cancel Booking"}
        cancelText="Keep Booking"
        type="danger"
      />
    </div>
  );
};

export default MyBookingDetails;
