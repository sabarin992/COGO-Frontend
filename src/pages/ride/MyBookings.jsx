import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  User,
  Users,
  X,
  Loader2,
  Calendar,
  BookmarkCheck,
  Filter,
  Car,
  Search,
} from "lucide-react";
import {
  getMyBookings,
  cancelRideRequest,
} from "../../services/rideService";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'pending' | 'accepted' | 'rejected' | 'cancelled'
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      const detail = err?.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : (Array.isArray(detail) && detail[0]?.msg) ||
            err?.response?.data?.message ||
            "Unable to load your ride bookings.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openCancelModal = (e, booking) => {
    e.stopPropagation(); // prevent card navigation
    setSelectedBookingForCancel(booking);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;

    const reqId = selectedBookingForCancel.ride_request_id;
    try {
      setProcessing(true);
      const updated = await cancelRideRequest(reqId);
      setBookings((prev) =>
        prev.map((b) =>
          b.ride_request_id === reqId ? { ...b, status: updated.status } : b
        )
      );
      toast.info("Ride booking request cancelled.");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to cancel ride booking."
      );
    } finally {
      setProcessing(false);
      setSelectedBookingForCancel(null);
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

  // Counts
  const pendingCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;
  const acceptedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "accepted"
  ).length;
  const rejectedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "rejected"
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "cancelled"
  ).length;

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === "all") return true;
    return b.status?.toLowerCase() === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white p-8 border border-gray-100 shadow-sm">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-black mb-3 mx-auto" />
          <p className="text-sm font-medium text-gray-600">Loading your ride bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your requested ride bookings as a passenger.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/ride/search")}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition shrink-0 self-start sm:self-auto"
        >
          <Search size={15} />
          <span>Find a Ride</span>
        </button>
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
          All ({bookings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("pending")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "pending"
              ? "bg-black text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pending ({pendingCount})
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

        <button
          type="button"
          onClick={() => setActiveFilter("cancelled")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "cancelled"
              ? "bg-black text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchBookings}
            className="underline font-bold text-red-700 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
            <BookmarkCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            You don't have any ride bookings yet.
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Search for available rides heading to your destination and send a request to join.
          </p>
          <button
            type="button"
            onClick={() => navigate("/ride/search")}
            className="rounded-xl bg-black px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 transition"
          >
            Find Rides Now
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <Filter size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No {activeFilter} bookings found
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mb-4">
            There are currently no bookings matching the "{activeFilter}" status filter.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="text-xs font-semibold text-black underline hover:text-gray-700"
          >
            Show All Bookings ({bookings.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isCanCancel =
              booking.status?.toLowerCase() === "pending" ||
              booking.status?.toLowerCase() === "accepted";

            return (
              <div
                key={booking.ride_request_id}
                onClick={() =>
                  navigate(`/profile/my-bookings/${booking.ride_request_id}`)
                }
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer"
              >
                {/* Associated Ride Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <Car size={18} className="text-gray-700 shrink-0" />
                    <span>
                      {booking.source || "Origin"} → {booking.destination || "Destination"}
                    </span>
                    {(booking.travel_date || booking.travel_time) && (
                      <span className="text-xs font-normal text-gray-500 border-l border-gray-200 pl-2 ml-1">
                        {formatDate(booking.travel_date)}
                        {booking.travel_time ? ` · ${formatTime(booking.travel_time)}` : ""}
                      </span>
                    )}
                  </div>

                  <span
                    className={`self-start sm:self-auto inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status?.toUpperCase()}
                  </span>
                </div>

                {/* Driver Info & Requested Seats */}
                <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {booking.driver_profile_pic ? (
                      <img
                        src={booking.driver_profile_pic}
                        alt={booking.driver_name}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white font-bold text-sm shrink-0">
                        {booking.driver_name?.charAt(0)?.toUpperCase() || "D"}
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        Driver: {booking.driver_name || "Ride Driver"}
                      </h4>
                      <p className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block mt-0.5 border border-purple-100">
                        {booking.seats_requested} {booking.seats_requested === 1 ? "seat booked" : "seats booked"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 font-medium">
                    <Clock size={13} className="inline mr-1 text-gray-400" />
                    {getRelativeTime(booking.created_at)}
                  </div>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-1">
                  <span className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1">
                    <span>View Booking Details</span>
                    <ArrowRight size={13} />
                  </span>

                  {isCanCancel && (
                    <button
                      type="button"
                      onClick={(e) => openCancelModal(e, booking)}
                      className="flex items-center gap-1 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <X size={14} />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Cancelling Booking */}
      <ConfirmationModal
        isOpen={!!selectedBookingForCancel}
        onClose={() => setSelectedBookingForCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Ride Booking?"
        message={`Are you sure you want to cancel your booking request for ${selectedBookingForCancel?.source} → ${selectedBookingForCancel?.destination}?`}
        confirmText={processing ? "Cancelling..." : "Yes, Cancel Booking"}
        cancelText="Keep Booking"
        type="danger"
      />
    </div>
  );
};

export default MyBookings;
