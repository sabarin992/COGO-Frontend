import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Ban, ShieldAlert } from "lucide-react";
import ConfirmationModal from "../../modals/ConfirmationModal";

const PRESET_REASONS = [
  "Driver emergency / unavailability",
  "Vehicle breakdown or mechanical failure",
  "Safety concern / platform policy violation",
  "Severe weather / route closure",
  "Duplicate or erroneous ride entry",
];

const RideCancelModal = ({
  isOpen,
  onClose,
  ride,
  onConfirmCancel,
  loading,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
      setConfirmModalOpen(false);
    }
  }, [isOpen, ride?.ride_id]);

  if (!isOpen || !ride) return null;

  const handleOpenConfirm = () => {
    if (!reason.trim()) {
      setError("Cancellation reason is mandatory.");
      return;
    }
    setError("");
    setConfirmModalOpen(true);
  };

  const handleFinalConfirm = () => {
    onConfirmCancel(ride.ride_id, reason.trim());
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors rounded-lg p-1 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Cancel Ride
              </h3>
              <p className="text-xs text-gray-500">
                Administrative cancellation with reason persistence
              </p>
            </div>
          </div>

          {/* Ride Summary Card */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Ride ID</span>
              <span className="font-mono font-bold text-gray-900">
                #RD-{String(ride.ride_id).padStart(4, "0")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Driver</span>
              <span className="font-semibold text-gray-900">
                {ride.driver_name || ride.driver?.full_name || "Unknown"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Route</span>
              <span className="font-medium text-gray-800 text-right truncate max-w-[240px]">
                {ride.source} &rarr; {ride.destination}
              </span>
            </div>
          </div>

          {/* Notice Alert */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 mb-4 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Cancelling this ride will notify the driver and automatically cancel all active passenger requests associated with this ride.
            </p>
          </div>

          {/* Reason Input */}
          <div className="space-y-2 mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Cancellation Reason <span className="text-rose-500">*</span>
            </label>

            {/* Quick preset suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setReason(preset);
                    setError("");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer text-left ${
                    reason === preset
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              placeholder="Provide a clear, detailed reason for cancelling this ride..."
              className={`w-full p-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                error
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-gray-200 focus:ring-black"
              }`}
            />

            {error && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer border border-gray-200/50 disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleOpenConfirm}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Cancel Ride"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => {
          if (!loading) setConfirmModalOpen(false);
        }}
        onConfirm={handleFinalConfirm}
        title="Confirm Ride Cancellation"
        message={`Are you sure you want to cancel ride #RD-${String(ride.ride_id).padStart(4, "0")}?\n\nReason: "${reason.trim()}"`}
        confirmText={loading ? "Cancelling..." : "Yes, Cancel Ride"}
        cancelText="Back"
        type="danger"
      />
    </>
  );
};

export default RideCancelModal;

