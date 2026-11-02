import React from "react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "Accepted",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  picked_up: {
    label: "Picked Up",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  },
};

const BookingStatusBadge = ({ status, size = "md" }) => {
  const normalized = (status || "").toLowerCase();
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
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;

