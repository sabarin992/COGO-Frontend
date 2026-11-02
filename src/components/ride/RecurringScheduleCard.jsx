import React from "react";
import {
  Repeat,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Eye,
  Edit2,
  Pause,
  Play,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  Layers,
} from "lucide-react";
import { formatRecurrenceLabel } from "../../utils/recurrenceUtils";

const RecurringScheduleCard = ({
  schedule,
  onView,
  onEdit,
  onPauseToggle,
  onCancel,
  loadingAction,
}) => {
  const isPaused = schedule.schedule_status === "Paused" || !schedule.is_active;
  const isCompleted = schedule.schedule_status === "Completed";
  const isActive = schedule.schedule_status === "Active" && schedule.is_active;

  const formattedTime = schedule.travel_time
    ? new Date(`1970-01-01T${schedule.travel_time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "-";

  const formattedStart = schedule.start_date
    ? new Date(`${schedule.start_date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const formattedEnd = schedule.end_date
    ? new Date(`${schedule.end_date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
              <Repeat size={16} />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {formatRecurrenceLabel(
                  schedule.recurrence_type,
                  schedule.selected_weekdays,
                  schedule.working_days,
                  schedule.off_days
                )}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            )}
            {isPaused && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Paused
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Source -> Destination */}
        <div className="space-y-2 mt-2">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <div className="text-sm font-bold text-gray-900 leading-tight">
              {schedule.source}
            </div>
          </div>
          <div className="pl-1 border-l-2 border-dashed border-gray-200 ml-1 h-3" />
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0" />
            <div className="text-sm font-bold text-gray-900 leading-tight">
              {schedule.destination}
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="p-5 bg-gray-50/50 grid grid-cols-2 gap-3 text-xs border-b border-gray-100">
        <div>
          <span className="text-gray-400 font-medium block">Schedule Period</span>
          <span className="text-gray-800 font-semibold mt-0.5 block">
            {formattedStart} – {formattedEnd}
          </span>
        </div>

        <div>
          <span className="text-gray-400 font-medium block">Departure</span>
          <span className="text-gray-800 font-semibold mt-0.5 block flex items-center gap-1">
            <Clock size={13} className="text-blue-500 inline" />
            {formattedTime}
          </span>
        </div>

        <div>
          <span className="text-gray-400 font-medium block">Generated Rides</span>
          <span className="text-gray-800 font-semibold mt-0.5 block flex items-center gap-1">
            <Layers size={13} className="text-purple-500 inline" />
            {schedule.total_rides || 0} Rides ({schedule.upcoming_rides || 0} upcoming)
          </span>
        </div>

        <div>
          <span className="text-gray-400 font-medium block">Seats & Vehicle</span>
          <span className="text-gray-800 font-semibold mt-0.5 block truncate">
            {schedule.available_seats} seats • {schedule.vehicle?.model || "Car"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-white flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={() => onView(schedule)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <Eye size={14} />
          <span>View</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(schedule)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <Edit2 size={14} />
          <span>Edit</span>
        </button>

        {!isCompleted && (
          <button
            type="button"
            onClick={() => onPauseToggle(schedule)}
            disabled={loadingAction === schedule.id}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition ${
              isPaused
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onCancel(schedule)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
          title="Cancel Schedule"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default RecurringScheduleCard;
