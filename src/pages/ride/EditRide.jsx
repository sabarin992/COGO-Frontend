import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getRideById, updateRide } from "../../services/rideService";
import { toast } from "react-toastify";

const EditRide = () => {
  const { rideId } = useParams();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await getRideById(rideId);

        setRide(response);
      } catch (error) {
        console.error("Failed to fetch ride:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await updateRide(rideId, {
        source: ride.source,
        destination: ride.destination,
        route: ride.route,
        travel_date: ride.travel_date,
        travel_time: ride.travel_time,
        available_seats: ride.available_seats,
        vehicle_id: ride.vehicle_id,
      });
      
      toast.success("Ride updated successfully.");
      navigate(`/ride/my-rides/${rideId}`);

    } catch (error) {
      console.error("Failed to update ride:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update ride. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-lg font-semibold text-gray-600">Loading ride...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-lg font-semibold text-red-500">Ride not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Ride</h1>

      <p className="text-gray-500 mt-2">Update your ride details.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
      >
        {/* Source */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Source
          </label>

          <input
            type="text"
            value={ride.source}
            onChange={(e) =>
              setRide({
                ...ride,
                source: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Destination */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Destination
          </label>

          <input
            type="text"
            value={ride.destination}
            onChange={(e) =>
              setRide({
                ...ride,
                destination: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Route */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Route
          </label>

          <textarea
            value={ride.route || ""}
            onChange={(e) =>
              setRide({
                ...ride,
                route: e.target.value,
              })
            }
            rows="3"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Travel Date
          </label>

          <input
            type="date"
            value={ride.travel_date}
            onChange={(e) =>
              setRide({
                ...ride,
                travel_date: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Time */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Travel Time
          </label>

          <input
            type="time"
            value={ride.travel_time}
            onChange={(e) =>
              setRide({
                ...ride,
                travel_time: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Available Seats */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Available Seats
          </label>

          <input
            type="number"
            min="1"
            value={ride.available_seats}
            onChange={(e) =>
              setRide({
                ...ride,
                available_seats: Number(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Vehicle */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vehicle ID
          </label>

          <input
            type="number"
            value={ride.vehicle_id}
            onChange={(e) =>
              setRide({
                ...ride,
                vehicle_id: Number(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* saving */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRide;
