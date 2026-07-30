import React from "react";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Verified",
  "Rejected",
];

const KycHeader = ({ statusFilter, setStatusFilter }) => {
  return (
    <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          KYC Verification Queue
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Review and process user identity verification submissions.
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex bg-gray-200/80 p-1 rounded-xl w-fit">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === status
                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status === "Verified" ? "Approved" : status}
          </button>
        ))}
      </div>
    </header>
  );
};

export default KycHeader;