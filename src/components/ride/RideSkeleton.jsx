import React from "react";

const RideSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">

      <div className="h-20 bg-gray-200" />

      <div className="p-6 space-y-5">

        <div className="h-5 bg-gray-200 rounded w-3/4" />

        <div className="h-5 bg-gray-200 rounded w-1/2" />

        <div className="h-5 bg-gray-200 rounded w-full" />

        <div className="h-5 bg-gray-200 rounded w-2/3" />

      </div>

      <div className="p-6 border-t">

        <div className="h-12 bg-gray-200 rounded-xl" />

      </div>

    </div>
  );
};

export default RideSkeleton;