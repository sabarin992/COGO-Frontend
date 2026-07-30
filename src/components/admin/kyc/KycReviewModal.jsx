import React from "react";
import { X } from "lucide-react";

import KycStatusBadge from "./KycStatusBadge";
import KycDocumentPreview from "./KycDocumentPreview";
import KycRejectionForm from "./KycRejectionForm";

const KycReviewModal = ({
  isOpen,
  onClose,

  selectedKyc,

  activeSide,
  setActiveSide,

  setFullPreviewOpen,

  rejectionCategory,
  setRejectionCategory,

  rejectionDetails,
  setRejectionDetails,

  onApprove,
  onReject,
}) => {
  if (!isOpen || !selectedKyc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">

          {/* Header */}

          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Reviewing Case
              </span>

              <h3 className="text-xl font-extrabold text-gray-900">
                {selectedKyc.user_name}
              </h3>

              <p className="text-xs text-gray-500 mt-0.5">
                Submission ID:
                {" "}
                KYC-X{selectedKyc.kyc_id}-{selectedKyc.user_code}
              </p>
            </div>

            <KycStatusBadge status={selectedKyc.status} />
          </div>

          {/* User Information */}

          <div className="grid grid-cols-2 gap-3 mb-6">

            <div className="p-3.5 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                User ID
              </p>

              <p className="text-sm font-semibold text-gray-900">
                {selectedKyc.user_code}
              </p>
            </div>

            <div className="p-3.5 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
                Submission Date
              </p>

              <p className="text-sm font-semibold text-gray-900">
                {selectedKyc.created_at}
              </p>
            </div>

          </div>

          <KycDocumentPreview
            selectedKyc={selectedKyc}
            activeSide={activeSide}
            setActiveSide={setActiveSide}
            setFullPreviewOpen={setFullPreviewOpen}
          />

          <KycRejectionForm
            rejectionCategory={rejectionCategory}
            setRejectionCategory={setRejectionCategory}
            rejectionDetails={rejectionDetails}
            setRejectionDetails={setRejectionDetails}
            onApprove={onApprove}
            onReject={onReject}
          />

        </div>
      </div>
    </div>
  );
};

export default KycReviewModal;