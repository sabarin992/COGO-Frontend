import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const KycRejectionForm = ({
  rejectionCategory,
  setRejectionCategory,
  rejectionDetails,
  setRejectionDetails,
  onApprove,
  onReject,
}) => {
  return (
    <div className="space-y-5 pt-4 border-t border-gray-200">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
        Verdict Action
      </h4>

      {/* Rejection Form */}
      <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl">
        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
          Rejection Reason
        </label>

        <select
          value={rejectionCategory}
          onChange={(e) => setRejectionCategory(e.target.value)}
          className="w-full bg-white border border-red-200 rounded-xl p-2.5 text-xs text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 mb-2 font-medium"
        >
          <option value="Blurry or Unreadable Image">
            Blurry or Unreadable Image
          </option>

          <option value="Expired Document">
            Expired Document
          </option>

          <option value="Name Mismatch">
            Name Mismatch
          </option>

          <option value="Incomplete Document">
            Incomplete Document
          </option>

          <option value="Other / Fraud Suspected">
            Other / Fraud Suspected
          </option>
        </select>

        <textarea
          value={rejectionDetails}
          onChange={(e) => setRejectionDetails(e.target.value)}
          placeholder="Additional details for the user (optional)..."
          rows={2}
          className="w-full bg-white border border-red-200 rounded-xl p-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onApprove}
          className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
          Approve
        </button>

        <button
          type="button"
          onClick={onReject}
          className="flex-1 py-3 border border-red-300 bg-white text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <XCircle className="w-4 h-4 text-red-600" />
          Reject
        </button>
      </div>
    </div>
  );
};

export default KycRejectionForm;