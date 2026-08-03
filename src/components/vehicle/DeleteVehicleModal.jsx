import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const DeleteVehicleModal = ({ isOpen, vehicle, onClose, onConfirm, deleting }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={deleting}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Container */}
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Delete Vehicle
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">
            {vehicle.brand} {vehicle.model}
          </span>{" "}
          (<span className="font-mono text-xs font-semibold">{vehicle.registration_number}</span>)? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Vehicle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleModal;
