import React from "react";
import { FileText, ZoomIn } from "lucide-react";

const KycDocumentPreview = ({
  selectedKyc,
  activeSide,
  setActiveSide,
  setFullPreviewOpen,
}) => {
  const activeDocUrl =
    activeSide === "front"
      ? selectedKyc?.front_document_url
      : selectedKyc?.back_document_url;

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-700" />

          <span className="text-xs font-bold text-gray-900">
            {selectedKyc.document_type} (
            {selectedKyc.document_number})
          </span>
        </div>

        {activeDocUrl && (
          <button
            type="button"
            onClick={() => setFullPreviewOpen(true)}
            className="text-xs font-semibold text-gray-900 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            Full Preview
          </button>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setActiveSide("front")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            activeSide === "front"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Front Side
        </button>

        <button
          type="button"
          disabled={!selectedKyc.back_document_url}
          onClick={() => setActiveSide("back")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
            !selectedKyc.back_document_url
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : activeSide === "back"
              ? "bg-gray-900 text-white border-gray-900 cursor-pointer"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          {selectedKyc.back_document_url
            ? "Back Side"
            : "No Back Side"}
        </button>
      </div>

      {/* Image */}
      <div className="aspect-[16/10] w-full bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden relative group flex items-center justify-center">
        {activeDocUrl ? (
          <>
            <img
              src={activeDocUrl}
              alt={`${selectedKyc.document_type}-${activeSide}`}
              className="w-full h-full object-contain bg-gray-900/5"
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => setFullPreviewOpen(true)}
                className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
                View Full Size
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />

            <p className="text-xs">
              No image available for this side
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycDocumentPreview;