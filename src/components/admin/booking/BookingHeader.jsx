import React from "react";

const STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const BookingHeader = ({ statusFilter, setStatusFilter }) => {
  return (
    <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Ride Booking Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitor ride requests and confirmed bookings, inspect passenger and driver information, and manage cancellations.
        </p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap bg-gray-200/80 p-1 rounded-xl w-fit gap-1">
        {STATUS_OPTIONS.map((status) => {
          const isActive =
            statusFilter.toLowerCase() === status.value.toLowerCase();

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatusFilter(status.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

export default BookingHeader;

