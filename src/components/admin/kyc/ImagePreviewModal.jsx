import React from "react";
import { X } from "lucide-react";

const ImagePreviewModal = ({
  open,
  onClose,
  selectedKyc,
  activeSide,
}) => {
  if (!open || !selectedKyc) return null;

  const activeDocUrl =
    activeSide === "front"
      ? selectedKyc.front_document_url
      : selectedKyc.back_document_url;

  if (!activeDocUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}

        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}

        <div className="text-center text-white mb-4">
          <h3 className="text-lg font-semibold">
            {selectedKyc.document_type}
          </h3>

          <p className="text-sm text-gray-300">
            {activeSide === "front"
              ? "Front Side"
              : "Back Side"}
          </p>

          <p className="text-xs text-gray-400">
            {selectedKyc.user_name}
          </p>
        </div>

        {/* Image */}

        <img
          src={activeDocUrl}
          alt={`${selectedKyc.document_type}-${activeSide}`}
          className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;