import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes, Confirm",
  cancelText = "No, Cancel",
  type = "info"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors rounded-lg p-1 hover:bg-gray-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            type === "danger" 
              ? "bg-red-50 text-red-600 border border-red-100" 
              : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all rounded-xl text-sm font-semibold cursor-pointer border border-gray-200/50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 text-white transition-all rounded-xl text-sm font-semibold cursor-pointer shadow-sm ${
                type === "danger"
                  ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                  : "bg-black hover:bg-gray-800 active:bg-gray-900"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
