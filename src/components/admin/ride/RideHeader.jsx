import React from "react";

const STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "CREATED", label: "Created" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "STARTED", label: "Started" },
  { value: "REACHED_PICKUP", label: "Reached Pickup" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const RideHeader = ({ statusFilter, setStatusFilter }) => {
  return (
    <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Ride Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitor ride lifecycle, inspect driver & vehicle information, review passengers, and manage cancellations.
        </p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap bg-gray-200/80 p-1 rounded-xl w-fit gap-1">
        {STATUS_OPTIONS.map((status) => {
          const isActive =
            statusFilter.toUpperCase() === status.value.toUpperCase();

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatusFilter(status.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default RideHeader;

