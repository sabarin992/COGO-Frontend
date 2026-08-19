import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock,
  User,
  Users,
  X,
  Loader2,
  Calendar,
  Inbox,
  Filter,
  Car,
} from "lucide-react";
import {
  getAllMyRideRequests,
  acceptRideRequest,
  rejectRideRequest,
} from "../../services/rideService";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";

const RideRequests = () => {
  const navigate = useNavigate();

  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("pending"); // 'all' | 'pending' | 'accepted' | 'rejected'
  const [selectedRequestForModal, setSelectedRequestForModal] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' | 'reject' | null
  const [processing, setProcessing] = useState(false);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllMyRideRequests();
      setAllRequests(data || []);
    } catch (err) {
      console.error("Failed to fetch all ride requests:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Unable to load your ride requests.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const openActionModal = (e, request, type) => {
    e.stopPropagation(); // prevent card click navigation
    setSelectedRequestForModal(request);
    setActionType(type);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequestForModal || !actionType) return;

    const reqId = selectedRequestForModal.ride_request_id;
    try {
      setProcessing(true);
      if (actionType === "accept") {
        const updated = await acceptRideRequest(reqId);
        setAllRequests((prev) =>
          prev.map((r) =>
            r.ride_request_id === reqId
              ? {
                  ...r,
                  status: updated.status,
                  available_seats: updated.available_seats ?? r.available_seats,
                }
              : r
          )
        );
        toast.success("Ride request accepted successfully!");
      } else if (actionType === "reject") {
        const updated = await rejectRideRequest(reqId);
        setAllRequests((prev) =>
          prev.map((r) =>
            r.ride_request_id === reqId ? { ...r, status: updated.status } : r
          )
        );
        toast.info("Ride request rejected.");
      }
    } catch (err) {
      console.error(`Failed to ${actionType} request:`, err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          `Failed to ${actionType} ride request.`
      );
    } finally {
      setProcessing(false);
      setSelectedRequestForModal(null);
      setActionType(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const created = new Date(dateStr);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `Requested ${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `Requested ${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
    return `Requested ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
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

  // Filter calculations
  const pendingCount = allRequests.filter(
    (r) => r.status?.toLowerCase() === "pending"
  ).length;
  const acceptedCount = allRequests.filter(
    (r) => r.status?.toLowerCase() === "accepted"
  ).length;
  const rejectedCount = allRequests.filter(
    (r) => r.status?.toLowerCase() === "rejected"
  ).length;

  // Filtered requests list
  const filteredRequests = allRequests.filter((r) => {
    if (activeFilter === "all") return true;
    return r.status?.toLowerCase() === activeFilter;
  });

  // Sort: Pending requests first, then newest created_at first
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const aPending = a.status?.toLowerCase() === "pending" ? 1 : 0;
    const bPending = b.status?.toLowerCase() === "pending" ? 1 : 0;
    if (aPending !== bPending) {
      return bPending - aPending; // Pending first
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white p-8 border border-gray-100 shadow-sm">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-black mb-3 mx-auto" />
          <p className="text-sm font-medium text-gray-600">Loading incoming ride requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ride Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all incoming passenger booking requests for rides you have posted.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "all"
              ? "bg-black text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({allRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeFilter === "pending"
              ? "bg-black text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pending ({pendingCount})
          {pendingCount > 0 && (
            <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("accepted")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "accepted"
              ? "bg-black text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Accepted ({acceptedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("rejected")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "rejected"
              ? "bg-black text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchAllRequests}
            className="underline font-bold text-red-700 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Requests List */}
      {allRequests.length === 0 ? (
        /* Total Empty State */
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
            <Inbox size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            You don't have any ride requests yet.
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            When passengers request seats on your posted rides, they will appear here for your review and approval.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile/my-rides")}
              className="rounded-xl bg-black px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition"
            >
              View My Rides
            </button>
          </div>
        </div>
      ) : sortedRequests.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <Filter size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No {activeFilter} ride requests
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mb-4">
            There are currently no requests matching the "{activeFilter}" status filter.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="text-xs font-semibold text-black underline hover:text-gray-700"
          >
            Show All Requests ({allRequests.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRequests.map((request) => {
            const isPending = request.status?.toLowerCase() === "pending";

            return (
              <div
                key={request.ride_request_id}
                onClick={() =>
                  navigate(`/profile/ride-requests/${request.ride_request_id}`)
                }
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer"
              >
                {/* Associated Ride Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <Car size={18} className="text-gray-700 shrink-0" />
                    <span>
                      {request.source || "Origin"} → {request.destination || "Destination"}
                    </span>
                    {(request.travel_date || request.travel_time) && (
                      <span className="text-xs font-normal text-gray-500 border-l border-gray-200 pl-2 ml-1">
                        {formatDate(request.travel_date)}
                        {request.travel_time ? ` · ${formatTime(request.travel_time)}` : ""}
                      </span>
                    )}
                  </div>

                  <span
                    className={`self-start sm:self-auto inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border ${getStatusBadge(
                      request.status
                    )}`}
                  >
                    {request.status?.toUpperCase()}
                  </span>
                </div>

                {/* Passenger Info & Seat Request */}
                <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {request.passenger_profile_pic ? (
                      <img
                        src={request.passenger_profile_pic}
                        alt={request.passenger_name}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white font-bold text-sm shrink-0">
                        {request.passenger_name?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {request.passenger_name || `Passenger #${request.passenger_id}`}
                      </h4>
                      <p className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block mt-0.5 border border-purple-100">
                        {request.seats_requested} {request.seats_requested === 1 ? "seat requested" : "seats requested"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 font-medium">
                    <Clock size={13} className="inline mr-1 text-gray-400" />
                    {getRelativeTime(request.created_at)}
                  </div>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-1">
                  <span className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1">
                    <span>View Full Details</span>
                    <ArrowRight size={13} />
                  </span>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => openActionModal(e, request, "reject")}
                        className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => openActionModal(e, request, "accept")}
                        className="flex items-center gap-1 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition"
                      >
                        <Check size={14} />
                        <span>Accept</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedRequestForModal}
        onClose={() => {
          setSelectedRequestForModal(null);
          setActionType(null);
        }}
        onConfirm={handleConfirmAction}
        title={actionType === "accept" ? "Accept Ride Request?" : "Reject Ride Request?"}
        message={
          actionType === "accept"
            ? `Are you sure you want to accept ${selectedRequestForModal?.passenger_name || "this passenger"}'s request for ${selectedRequestForModal?.source} → ${selectedRequestForModal?.destination}?`
            : `Are you sure you want to reject ${selectedRequestForModal?.passenger_name || "this passenger"}'s request?`
        }
        confirmText={
          processing
            ? "Processing..."
            : actionType === "accept"
            ? "Yes, Accept"
            : "Yes, Reject"
        }
        cancelText="Cancel"
        type={actionType === "accept" ? "primary" : "danger"}
      />
    </div>
  );
};

export default RideRequests;