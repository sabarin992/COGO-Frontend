import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  User,
  ShieldCheck,
  Loader2,
  Navigation,
} from "lucide-react";
import {
  getSingleRideRequestDetails,
  acceptRideRequest,
  rejectRideRequest,
} from "../../services/rideService";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";

const RideRequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processing, setProcessing] = useState(false);
  const [modalType, setModalType] = useState(null); // 'accept' | 'reject' | null

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSingleRideRequestDetails(requestId);
      setRequest(data);
    } catch (err) {
      console.error("Failed to fetch request details:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Unable to load request details.";
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

  const handleConfirmAction = async () => {
    if (!modalType || !request) return;

    try {
      setProcessing(true);
      if (modalType === "accept") {
        const updated = await acceptRideRequest(request.ride_request_id);
        setRequest((prev) => ({
          ...prev,
          status: updated.status,
          available_seats: updated.available_seats ?? prev.available_seats,
        }));
        toast.success("Ride request accepted successfully!");
      } else if (modalType === "reject") {
        const updated = await rejectRideRequest(request.ride_request_id);
        setRequest((prev) => ({
          ...prev,
          status: updated.status,
        }));
        toast.info("Ride request rejected.");
      }
    } catch (err) {
      console.error(`Failed to ${modalType} request:`, err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          `Failed to ${modalType} ride request.`
      );
    } finally {
      setProcessing(false);
      setModalType(null);
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
          <p className="text-sm font-medium text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center shadow-sm max-w-md mx-auto">
        <p className="text-sm font-semibold text-red-600 mb-4">{error || "Request not found."}</p>
        <button
          type="button"
          onClick={() => navigate("/profile/ride-requests")}
          className="rounded-xl bg-black px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition"
        >
          Back to Ride Requests
        </button>
      </div>
    );
  }

  const isPending = request.status?.toLowerCase() === "pending";

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate("/profile/ride-requests")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        <span>Back to Ride Requests</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request #{request.ride_request_id} Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review passenger and ride details for this request.
          </p>
        </div>

        <span
          className={`self-start sm:self-auto inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold border ${getStatusBadge(
            request.status
          )}`}
        >
          {request.status?.toUpperCase()}
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
              <p className="font-semibold text-gray-900 text-base">{request.source || "N/A"}</p>
            </div>
          </div>

          <span className="hidden sm:block text-gray-300 font-bold text-xl">→</span>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-xs shrink-0">
              B
            </div>
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <p className="font-semibold text-gray-900 text-base">{request.destination || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Calendar size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Travel Date</p>
              <p className="font-semibold text-xs text-gray-900">{formatDate(request.travel_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Clock size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Departure Time</p>
              <p className="font-semibold text-xs text-gray-900">{formatTime(request.travel_time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <Users size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Available Seats</p>
              <p className="font-semibold text-xs text-gray-900">{request.available_seats ?? "N/A"} left</p>
            </div>
          </div>
        </div>

        {request.route && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <Navigation size={14} className="text-blue-500" />
            <span>Route: <strong className="text-gray-900">{request.route}</strong></span>
          </div>
        )}
      </div>

      {/* Passenger Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Passenger Information
        </p>

        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          {request.passenger_profile_pic ? (
            <img
              src={request.passenger_profile_pic}
              alt={request.passenger_name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white font-bold text-base">
              {request.passenger_name?.charAt(0)?.toUpperCase() || "P"}
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {request.passenger_name || `Passenger #${request.passenger_id}`}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <User size={14} />
              Registered Passenger
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 border border-gray-100">
            <Users size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-gray-500">Seats Requested</p>
              <p className="font-bold text-gray-900 text-sm">
                {request.seats_requested} {request.seats_requested === 1 ? "seat" : "seats"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 border border-gray-100">
            <Clock size={18} className="text-gray-500 shrink-0" />
            <div>
              <p className="text-gray-500">Request Submitted At</p>
              <p className="font-bold text-gray-900 text-sm">
                {formatCreatedTime(request.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isPending ? (
        <div className="flex items-center justify-end gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            disabled={processing}
            onClick={() => setModalType("reject")}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <X size={16} />
            <span>Reject Request</span>
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={() => setModalType("accept")}
            className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            <Check size={16} />
            <span>Accept Request</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center text-xs text-gray-500 font-medium">
          This ride request has already been processed with status: <strong className="text-gray-900 uppercase">{request.status}</strong>.
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmAction}
        title={modalType === "accept" ? "Accept Ride Request?" : "Reject Ride Request?"}
        message={
          modalType === "accept"
            ? "Are you sure you want to accept this ride request? This will deduct the requested seats from your ride."
            : "Are you sure you want to reject this ride request? The passenger will be notified."
        }
        confirmText={
          processing
            ? "Processing..."
            : modalType === "accept"
            ? "Yes, Accept"
            : "Yes, Reject"
        }
        cancelText="Cancel"
        type={modalType === "accept" ? "primary" : "danger"}
      />
    </div>
  );
};

export default RideRequestDetails;
