import React from "react";
import { BookmarkCheck } from "lucide-react";
import BookingTableRow from "./BookingTableRow";

const BookingTable = ({
  loading,
  bookings = [],
  selectedBooking,
  onViewBooking,
  onCancelBooking,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Booking ID
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Passenger
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Driver
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Route
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Travel Date
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">
                Seats
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                Booking Date
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
                      Loading bookings queue...
                    </p>
                  </div>
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingTableRow
                  key={booking.booking_id}
                  booking={booking}
                  isSelected={selectedBooking?.booking_id === booking.booking_id}
                  onView={onViewBooking}
                  onCancel={onCancelBooking}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <BookmarkCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        No bookings found
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Try modifying search query or clearing the status filter.
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

export default BookingTable;

