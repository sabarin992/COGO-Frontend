import React from "react";

const STATUS_CONFIG = {
  CREATED: {
    label: "Created",
    classes: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  UPCOMING: {
    label: "Upcoming",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  STARTED: {
    label: "Started",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  REACHED_PICKUP: {
    label: "Reached Pickup",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  ONGOING: {
    label: "Ongoing",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-teal-50 text-teal-700 border-teal-200",
    dot: "bg-teal-500",
  },
  CANCELLED: {
    label: "Cancelled",
    classes: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const RideStatusBadge = ({ status, showDot = true, size = "md" }) => {
  const normalized = (status || "").toUpperCase();
  const config = STATUS_CONFIG[normalized] || {
    label: status || "Unknown",
    classes: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-tight ${sizeClasses} ${config.classes}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`}
        />
      )}
      {config.label}
    </span>
  );
};

export default RideStatusBadge;

