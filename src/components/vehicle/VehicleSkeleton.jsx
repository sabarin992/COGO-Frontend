import React from "react";

const VehicleSkeleton = ({ count = 2 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col"
        >
          {/* Top Image Banner Skeleton */}
          <div className="relative aspect-[16/10] bg-gray-200 w-full">
            {/* Active Badge Skeleton */}
            <div className="absolute top-4 left-4 w-16 h-6 bg-gray-300 rounded-full" />
            
            {/* Edit / Delete Buttons Skeleton */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Bottom Info Section Skeleton */}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              {/* Title Skeleton */}
              <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-4" />
              
              {/* Divider Skeleton */}
              <div className="h-px bg-gray-100 w-full my-4" />
              
              {/* 3-Column Metadata Skeleton */}
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div>
                  <div className="h-3 bg-gray-200 rounded w-10 mb-2" />
                  <div className="h-5 bg-gray-300 rounded w-14" />
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-12 mb-2" />
                  <div className="h-5 bg-gray-300 rounded w-20" />
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-5 bg-gray-300 rounded w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleSkeleton;
