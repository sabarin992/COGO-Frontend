import React from "react";
import {
  X,
  Repeat,
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatRecurrenceLabel } from "../../utils/recurrenceUtils";

const ViewScheduleModal = ({ isOpen, onClose, scheduleDetails, loading }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const schedule = scheduleDetails;

  const formattedTime = schedule?.travel_time
    ? new Date(`1970-01-01T${schedule.travel_time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Repeat size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recurring Ride Schedule</h3>
              <p className="text-xs text-gray-500">
                Schedule #{schedule?.id} •{" "}
                {formatRecurrenceLabel(
                  schedule?.recurrence_type,
                  schedule?.selected_weekdays,
                  schedule?.working_days,
                  schedule?.off_days
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-500">Loading schedule details...</p>
            </div>
          ) : !schedule ? (
            <p className="text-sm text-gray-500 text-center py-8">Schedule not found.</p>
          ) : (
            <>
              {/* Route & Primary Stats Card */}
              <div className="p-5 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Journey Overview
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-base font-bold text-white">
                      {schedule.source} → {schedule.destination}
                    </p>
                    {schedule.route && (
                      <p className="text-xs text-blue-300">Via {schedule.route}</p>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-gray-400">Departure</span>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5 sm:justify-end">
                      <Clock size={14} className="text-blue-400" />
                      {formattedTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-800 text-xs">
                  <div>
                    <span className="text-gray-400">Status</span>
                    <p className="font-semibold text-white mt-0.5">{schedule.schedule_status}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Period</span>
                    <p className="font-semibold text-white mt-0.5">
                      {schedule.start_date} to {schedule.end_date}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Rides</span>
                    <p className="font-semibold text-white mt-0.5">{schedule.total_rides || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Seats per Ride</span>
                    <p className="font-semibold text-white mt-0.5">{schedule.available_seats}</p>
                  </div>
                </div>
              </div>

              {/* Generated Rides Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">
                    Generated Journey Dates ({schedule.rides?.length || 0})
                  </h4>
                  <span className="text-xs text-gray-500">Each ride is an independent booking</span>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  {schedule.rides?.map((r) => {
                    const rideDateFormatted = new Date(`${r.travel_date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    );

                    return (
                      <div
                        key={r.ride_id}
                        className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                            #{r.ride_id}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{rideDateFormatted}</p>
                            <p className="text-[11px] text-gray-500">
                              {r.available_seats} seats • Status:{" "}
                              <span className="font-medium text-gray-800">{r.status}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {r.has_bookings ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {r.accepted_bookings_count} Booked
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-medium">No bookings</span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate(`/ride/my-rides/${r.ride_id}`);
                            }}
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-200/60 rounded-lg transition"
                            title="View Ride Details"
                          >
                            <ExternalLink size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-black text-white hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewScheduleModal;
