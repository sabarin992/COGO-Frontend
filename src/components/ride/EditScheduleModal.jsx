import React, { useState, useEffect } from "react";
import { X, Clock, Users, Calendar, AlertCircle, Save } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const EditScheduleModal = ({ isOpen, onClose, schedule, onSave, saving }) => {
  const [seats, setSeats] = useState(1);
  const [travelTime, setTravelTime] = useState("");
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (schedule) {
      setSeats(schedule.available_seats || 1);
      setTravelTime(schedule.travel_time ? schedule.travel_time.substring(0, 5) : "08:00");
      if (schedule.end_date) {
        setEndDate(new Date(`${schedule.end_date}T00:00:00`));
      }
    }
  }, [schedule]);

  if (!isOpen || !schedule) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!seats || seats <= 0) {
      toast.error("Available seats must be at least 1.");
      return;
    }

    if (!travelTime) {
      toast.error("Please enter a departure time.");
      return;
    }

    const updatePayload = {
      available_seats: Number(seats),
      travel_time: travelTime.length === 5 ? `${travelTime}:00` : travelTime,
    };

    if (endDate) {
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, "0");
      const day = String(endDate.getDate()).padStart(2, "0");
      updatePayload.end_date = `${year}-${month}-${day}`;
    }

    onSave(schedule.id, updatePayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Edit Recurring Schedule</h3>
            <p className="text-xs text-gray-500">
              Schedule #{schedule.id} • {schedule.source} → {schedule.destination}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* CRITICAL NOTICE: Booked rides vs unbooked rides */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">Passenger Booking Protection</p>
              <p className="leading-relaxed">
                Changes made here will only apply to <strong>future unbooked rides</strong>.
                Any rides that already have accepted passenger bookings will remain unchanged to prevent disruption to confirmed travelers.
              </p>
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Departure Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="time"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Available Seats */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Available Seats (per ride) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                min="1"
                max={schedule.vehicle?.seating_capacity || 8}
                value={seats}
                onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Maximum vehicle capacity: {schedule.vehicle?.seating_capacity || "N/A"} seats
            </p>
          </div>

          {/* Recurrence End Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Extend / Adjust End Date
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              />
              <DatePicker
                selected={endDate}
                onChange={(d) => setEndDate(d)}
                minDate={new Date()}
                dateFormat="EEEE, dd MMMM yyyy"
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Extending the end date will generate rides for the new period. Shortening will remove unbooked future rides.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold rounded-xl bg-black text-white hover:bg-gray-800 transition shadow-sm disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;
