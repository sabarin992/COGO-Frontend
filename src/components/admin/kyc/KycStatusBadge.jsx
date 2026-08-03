import React from "react";

const KycStatusBadge = ({ status }) => {
  const normalizedStatus = (status || "").toLowerCase();

  const badgeStyles = {
    verified:
      "bg-green-100 text-green-700 border border-green-200",
    approved:
      "bg-green-100 text-green-700 border border-green-200",
    rejected:
      "bg-red-100 text-red-700 border border-red-200",
    pending:
      "bg-amber-100 text-amber-800 border border-amber-200",
  };

  const badgeText = {
    verified: "Approved",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
  };

  const colorClass =
    badgeStyles[normalizedStatus] || badgeStyles.pending;

  const text =
    badgeText[normalizedStatus] || "Pending";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-tight ${colorClass}`}
    >
      {text}
    </span>
  );
};

export default KycStatusBadge;