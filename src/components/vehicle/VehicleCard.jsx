import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  // Get main image or fallback placeholder
  const mainImage =
    Array.isArray(vehicle?.images) && vehicle.images.length > 0
      ? vehicle.images[0]
      : "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100/80 flex flex-col group">
      {/* Top Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Active Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black/95 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm tracking-wide">
            Active
          </span>
        </div>

        {/* Floating Action Buttons (Edit & Delete) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => onEdit && onEdit(vehicle)}
            title="Edit Vehicle"
            className="w-10 h-10 bg-white hover:bg-gray-100 text-gray-900 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Pencil className="w-4 h-4 text-gray-800" />
          </button>

          <button
            onClick={() => onDelete && onDelete(vehicle)}
            title="Delete Vehicle"
            className="w-10 h-10 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Vehicle Name (Brand + Model) */}
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            {vehicle.brand} {vehicle.model}
          </h3>

          {/* Subtle Horizontal Separator */}
          <div className="border-b border-gray-100 my-4" />

          {/* 3-Column Stats Metadata */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
            <div>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                YEAR
              </span>
              <span className="block text-sm sm:text-base font-bold text-gray-900 truncate">
                {vehicle.year}
              </span>
            </div>

            <div>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                COLOR
              </span>
              <span className="block text-sm sm:text-base font-bold text-gray-900 truncate">
                {vehicle.color}
              </span>
            </div>

            <div>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                LICENSE PLATE
              </span>
              <span className="block text-sm sm:text-base font-bold text-gray-900 truncate">
                {vehicle.registration_number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
