import React from "react";
import { Car } from "lucide-react";
import RideTableRow from "./RideTableRow";

const RideTable = ({
  loading,
  rides = [],
  selectedRide,
  onViewRide,
  onCancelRide,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Ride ID
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Driver
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Source
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Destination
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Travel Date
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Travel Time
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">
                Seats
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500">
                      Loading rides...
                    </p>
                  </div>
                </td>
              </tr>
            ) : rides.length > 0 ? (
              rides.map((ride) => (
                <RideTableRow
                  key={ride.ride_id}
                  ride={ride}
                  isSelected={selectedRide?.ride_id === ride.ride_id}
                  onView={onViewRide}
                  onCancel={onCancelRide}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        No rides found
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Try clearing search terms or selecting a different status filter.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RideTable;

