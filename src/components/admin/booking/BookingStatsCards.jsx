import React from "react";
import {
  BookmarkCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";

const STATS_CONFIG = [
  {
    key: "total",
    label: "Total Requests",
    icon: BookmarkCheck,
    bg: "bg-slate-50",
    text: "text-slate-900",
    iconBg: "bg-slate-900 text-white",
    border: "border-slate-200",
  },
  {
    key: "pending",
    label: "Pending Requests",
    icon: Clock,
    bg: "bg-amber-50/60",
    text: "text-amber-800",
    iconBg: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
  },
  {
    key: "accepted",
    label: "Accepted Bookings",
    icon: CheckCircle2,
    bg: "bg-emerald-50/60",
    text: "text-emerald-800",
    iconBg: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
  },
  {
    key: "rejected",
    label: "Rejected Requests",
    icon: XCircle,
    bg: "bg-red-50/60",
    text: "text-red-800",
    iconBg: "bg-red-100 text-red-700",
    border: "border-red-200",
  },
  {
    key: "cancelled",
    label: "Cancelled Bookings",
    icon: Ban,
    bg: "bg-gray-50",
    text: "text-gray-800",
    iconBg: "bg-gray-200 text-gray-700",
    border: "border-gray-200",
  },
];

const BookingStatsCards = ({ stats, loading, activeStatus, onSelectStatus }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {STATS_CONFIG.map((item) => {
        const IconComponent = item.icon;
        const count = stats ? stats[item.key] ?? 0 : 0;
        const isSelected =
          (item.key === "total" && activeStatus === "All") ||
          activeStatus.toLowerCase() === item.key.toLowerCase();

        return (
          <div
            key={item.key}
            onClick={() => {
              if (onSelectStatus) {
                onSelectStatus(item.key === "total" ? "All" : item.key);
              }
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
              item.bg
            } ${item.border} ${
              isSelected
                ? "ring-2 ring-black shadow-md scale-[1.02]"
                : "hover:shadow-sm hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 line-clamp-1">
                {item.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            {loading ? (
              <div className="h-7 w-12 bg-gray-200/80 rounded animate-pulse" />
            ) : (
              <p className={`text-2xl font-extrabold tracking-tight ${item.text}`}>
                {count.toLocaleString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingStatsCards;

