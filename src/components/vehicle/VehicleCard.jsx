import React from "react";
import { Pencil, Trash2, CheckCircle, Car } from "lucide-react";

const VehicleCard = ({
  vehicle,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onSelect,
}) => {
  // Get main image or fallback placeholder
  const mainImage =
    Array.isArray(vehicle?.images) && vehicle.images.length > 0
      ? vehicle.images[0]
      : "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop";

  const yearDisplay = vehicle?.year || vehicle?.manufacture_year || "-";
  const colorDisplay = vehicle?.color || "-";
  const plateDisplay = vehicle?.registration_number || vehicle?.license_plate || vehicle?.plate_number || "-";

  return (
    <div
      className={`
        bg-white rounded-3xl overflow-hidden
        transition-all duration-300
        border-2 flex flex-col justify-between h-full
        ${
          selected
            ? "border-black shadow-xl ring-2 ring-black/10"
            : "border-gray-100 shadow-sm hover:shadow-md"
        }
      `}
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={`${vehicle?.brand || "Vehicle"} ${vehicle?.model || ""}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />

        {/* Active Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-black/90 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
            Active
          </span>
        </div>

        {/* Edit/Delete Buttons */}
        {!selectable && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(vehicle);
              }}
              className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition"
              title="Edit Vehicle"
            >
              <Pencil className="w-4 h-4 text-gray-800" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(vehicle);
              }}
              className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-50 transition"
              title="Delete Vehicle"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Selected Badge */}
        {selectable && selected && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span className="text-xs font-bold text-emerald-800">Selected</span>
          </div>
        )}
      </div>

      {/* Vehicle Information */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {vehicle?.brand} {vehicle?.model}
              </h3>
              {vehicle?.vehicle_type && (
                <span className="inline-block text-xs font-semibold text-gray-500 mt-0.5">
                  {vehicle.vehicle_type} {vehicle?.seating_capacity ? `· ${vehicle.seating_capacity} Seats` : ""}
                </span>
              )}
            </div>
          </div>

          <div className="border-b border-gray-100 my-4" />

          {/* 3-Column Vehicle Details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                Year
              </p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">
                {yearDisplay}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                Color
              </p>
              <p className="font-bold text-gray-900 text-sm capitalize mt-0.5">
                {colorDisplay}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-0">
              <p className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                Plate
              </p>
              <p
                className="font-bold text-gray-900 text-sm truncate mt-0.5"
                title={plateDisplay}
              >
                {plateDisplay}
              </p>
            </div>
          </div>
        </div>

        {/* Select Button */}
        {selectable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(vehicle);
            }}
            className={`
              mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm

              ${
                selected
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }
            `}
          >
            {selected ? "Selected" : "Select Vehicle"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
