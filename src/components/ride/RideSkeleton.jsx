import React from "react";

const RideSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-gray-100 rounded-xl" />
        <div className="h-12 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-10 bg-gray-100 rounded-xl" />
      <div className="pt-3 border-t border-gray-100 flex gap-2">
        <div className="h-9 bg-gray-200 rounded-xl flex-1" />
        <div className="h-9 bg-gray-200 rounded-xl flex-1" />
        <div className="h-9 bg-gray-200 rounded-xl w-10" />
      </div>
    </div>
  );
};

export default RideSkeleton;