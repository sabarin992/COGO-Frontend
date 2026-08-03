import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Plus } from "lucide-react";

const EmptyKycState = () => {
  return (
    <div className="w-full bg-white rounded-[28px] border border-gray-100/90 p-8 sm:p-14 md:p-16 flex flex-col items-center justify-center text-center shadow-sm my-4 transition-all">
      {/* Centered Icon Container */}
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 text-gray-700 border border-gray-100 shadow-inner">
        <ShieldCheck className="w-8 h-8 text-gray-800" />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
        No KYC Documents Found
      </h3>

      {/* Description */}
      <p className="text-gray-500 max-w-md text-sm sm:text-base mb-8 leading-relaxed">
        You haven't uploaded any KYC verification documents yet. Upload your documents to verify your profile and start offering rides.
      </p>

      {/* Call To Action Button */}
      <Link
        to="/profile/add-kyc"
        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 text-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add New Document
      </Link>
    </div>
  );
};

export default EmptyKycState;
