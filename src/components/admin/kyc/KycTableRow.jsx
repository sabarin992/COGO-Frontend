import React from "react";
import KycStatusBadge from "./KycStatusBadge";

const KycTableRow = ({
  item,
  isSelected,
  setSelectedKyc,
  setReviewModalOpen,
}) => {
  return (
    <tr
      onClick={() => setSelectedKyc(item)}
      className={`cursor-pointer transition-colors ${
        isSelected
          ? "bg-gray-100/90 font-medium"
          : "hover:bg-gray-50"
      }`}
    >
      {/* User */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {item.user_name
              ? item.user_name.slice(0, 2).toUpperCase()
              : "US"}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {item.user_name}
            </p>

            <p className="text-[11px] text-gray-500">
              {item.user_code}
            </p>
          </div>
        </div>
      </td>

      {/* Document Type */}
      <td className="px-6 py-4 text-sm text-gray-800">
        {item.document_type}
      </td>

      {/* Submission Date */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {item.created_at}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <KycStatusBadge status={item.status} />

          {item.status === "rejected" &&
            item.rejection_reason && (
              <p className="text-[11px] text-red-600 font-medium line-clamp-1">
                Reason: {item.rejection_reason}
              </p>
            )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedKyc(item);
            setReviewModalOpen(true);
          }}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          Review
        </button>
      </td>
    </tr>
  );
};

export default KycTableRow;