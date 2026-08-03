import React from "react";
import { Link } from "react-router-dom";
import { Car, Plus } from "lucide-react";

const EmptyVehicleState = () => {
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm my-4">
      {/* Decorative Icon Container */}
      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 text-gray-400 border border-gray-100 shadow-inner">
        <Car className="w-10 h-10 text-gray-700" />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No Vehicles Found
      </h3>

      {/* Subtitle */}
      <p className="text-gray-500 max-w-md text-sm mb-6 leading-relaxed">
        You haven't added any vehicles to your profile yet. Add a vehicle to manage your active transport fleet and accept ride requests.
      </p>

      {/* Add New Vehicle Button */}
      <Link
        to="/profile/vehicles/add"
        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-95 text-sm"
      >
        <Plus className="w-4 h-4" />
        Add New Vehicle
      </Link>
    </div>
  );
};

export default EmptyVehicleState;
