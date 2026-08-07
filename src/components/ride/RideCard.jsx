import React from "react";
import { MapPin, Calendar, Clock, Users, Eye } from "lucide-react";

const RideCard = ({ ride, onView }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

      {/* Header */}
      <div className="bg-black text-white p-5">
        <div className="flex items-center gap-2">
          <MapPin size={20} />
          <h2 className="text-xl font-bold">
            {ride.source} → {ride.destination}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>{ride.travel_date}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span>{ride.travel_time}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-500 text-sm uppercase">
            Route
          </h3>

          <p className="mt-1 text-gray-800">
            {ride.route}
          </p>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Users size={18} />
          <span>
            {ride.available_seats} Available Seats
          </span>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">

        <button
          onClick={() => onView(ride)}
          className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition"
        >
          <Eye size={18} />
          View Details
        </button>

      </div>

    </div>
  );
};

export default RideCard;