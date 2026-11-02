import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  Users,
  Phone,
  Mail,
  ShieldAlert,
  AlertCircle,
  FileText,
  Ban,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import RideStatusBadge from "../../ride/RideStatusBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  try {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  } catch (e) {
    return timeStr;
  }
};

const formatDateTime = (dtStr) => {
  if (!dtStr) return "N/A";
  try {
    const d = new Date(dtStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dtStr;
  }
};

const RideDetailsModal = ({
  isOpen,
  onClose,
  ride,
  loading,
  onInitiateCancel,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isCancellable =
    ride && ride.status !== "COMPLETED" && ride.status !== "CANCELLED";

  const allRequests = ride?.requests || [];
  const pendingRequests = allRequests.filter((r) => r.status === "pending");
  const acceptedPassengers = allRequests.filter(
    (r) => r.status === "accepted" || r.status === "picked_up"
  );
  const rejectedOrCancelled = allRequests.filter(
    (r) => r.status === "rejected" || r.status === "cancelled"
  );

  const displayedRequests =
    activeTab === "all"
      ? allRequests
      : activeTab === "accepted"
      ? acceptedPassengers
      : activeTab === "pending"
      ? pendingRequests
      : rejectedOrCancelled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Ride Details
                </h3>
                {ride && (
                  <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    #RD-{String(ride.ride_id).padStart(4, "0")}
                  </span>
                )}
                {ride && <RideStatusBadge status={ride.status} size="sm" />}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Comprehensive inspection of ride, vehicle, driver and requests
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-black transition-colors rounded-lg p-1.5 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading || !ride ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 font-medium">
                Fetching ride details...
              </p>
            </div>
          ) : (
            <>
              {/* Cancellation Banner if cancelled */}
              {ride.status === "CANCELLED" && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-rose-900">
                      This ride was cancelled
                    </p>
                    {ride.cancellation_reason && (
                      <p className="text-xs text-rose-800">
                        <span className="font-semibold">Reason:</span>{" "}
                        {ride.cancellation_reason}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-rose-600 pt-1">
                      {ride.cancelled_by_admin && (
                        <span>By Admin: {ride.cancelled_by_admin}</span>
                      )}
                      {ride.cancelled_at && (
                        <span>At: {formatDateTime(ride.cancelled_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Grid: Route & Travel Info */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Route & Schedule
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Origin -> Destination */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        A
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Starting Location
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {ride.source}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        B
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Destination
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {ride.destination}
                        </p>
                      </div>
                    </div>

                    {ride.route && (
                      <div className="pl-9 text-xs text-gray-600 bg-white/60 p-2 rounded-lg border border-gray-100">
                        <span className="font-medium text-gray-500">
                          Via:
                        </span>{" "}
                        {ride.route}
                      </div>
                    )}
                  </div>

                  {/* Travel Date, Time & Seats */}
                  <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Travel Date
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatDate(ride.travel_date)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Travel Time
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatTime(ride.travel_time)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Available Seats
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {ride.available_seats} seats
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Created Date
                      </span>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        {formatDateTime(ride.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Driver & Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Driver Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Driver Information
                    </h4>
                    <span className="text-xs font-mono text-gray-400">
                      ID #{ride.driver?.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    {ride.driver?.profile_pic ? (
                      <img
                        src={ride.driver.profile_pic}
                        alt={ride.driver.full_name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center shrink-0">
                        {ride.driver?.full_name
                          ? ride.driver.full_name.slice(0, 2).toUpperCase()
                          : "DR"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-base font-bold text-gray-900 truncate">
                        {ride.driver?.full_name || "Unknown Driver"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Platform Registered Driver
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{ride.driver?.email || "No email available"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{ride.driver?.phone || "No phone available"}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Vehicle Information
                    </h4>
                    <span className="text-xs font-mono text-gray-400">
                      ID #{ride.vehicle?.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {ride.vehicle?.brand} {ride.vehicle?.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ride.vehicle?.vehicle_type} &bull; {ride.vehicle?.color} &bull; {ride.vehicle?.year}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
                    <div>
                      <p className="text-gray-400 text-[11px]">Plate Number</p>
                      <p className="font-mono font-bold text-gray-900">
                        {ride.vehicle?.registration_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px]">Seating Capacity</p>
                      <p className="font-semibold text-gray-900">
                        {ride.vehicle?.seating_capacity || "N/A"} Persons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers & Requests Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Passengers & Ride Requests
                    </h4>
                    <p className="text-xs text-gray-500">
                      Active joined passengers and incoming passenger requests
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setActiveTab("all")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === "all"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      All ({allRequests.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("accepted")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === "accepted"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Accepted ({acceptedPassengers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("pending")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === "pending"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Pending ({pendingRequests.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("rejected")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === "rejected"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Cancelled/Rejected ({rejectedOrCancelled.length})
                    </button>
                  </div>
                </div>

                {displayedRequests.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {displayedRequests.map((req) => (
                      <div
                        key={req.ride_request_id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {req.profile_pic ? (
                            <img
                              src={req.profile_pic}
                              alt={req.full_name}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center shrink-0">
                              {req.full_name ? req.full_name.slice(0, 2).toUpperCase() : "PA"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {req.full_name}
                            </p>
                            <div className="flex items-center gap-3 text-gray-500 text-[11px] mt-0.5">
                              {req.email && <span>{req.email}</span>}
                              {req.phone && <span>&bull; {req.phone}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <span className="font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                            {req.seats_requested} {req.seats_requested === 1 ? "seat" : "seats"}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              req.status === "accepted" || req.status === "picked_up"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : req.status === "pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {req.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    No requests found in this category.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            {ride && isCancellable && (
              <button
                type="button"
                onClick={() => onInitiateCancel && onInitiateCancel(ride)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <Ban className="w-4 h-4" />
                Cancel Ride
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsModal;

