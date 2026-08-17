import React, { useState } from "react";
import { Search, MapPin, Calendar, Clock, Users } from "lucide-react";

import { searchRides } from "../../services/rideService";
import RideSearchList from "../../components/ride/RideSearchList";

const SearchRides = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState(null);
  const [seatRequired, setSeatRequired] = useState(1);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get today's date using local browser time
  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  // Get current local time
  const currentTime = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join(":");

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");

    if (!source.trim()) {
      setError("Please enter your source.");
      return;
    }

    if (!destination.trim()) {
      setError("Please enter your destination.");
      return;
    }

    if (!travelDate) {
      setError("Please select a travel date.");
      return;
    }

    // if (!travelTime) {
    //   setError("Please select a travel time.");
    //   return;
    // }

    // if (travelDate === today && travelTime < currentTime) {
    //   setError("Please select a future time.");
    //   return;
    // }

    if (seatRequired < 1) {
      setError("At least one seat is required.");
      return;
    }

    const searchData = {
      source: source.trim(),
      destination: destination.trim(),
      travel_date: travelDate,
      travel_time: travelTime,
      seat_required: seatRequired,
    };

    try {
      setLoading(true);

      const data = await searchRides(searchData);

      setRides(data);
    } catch (error) {
        console.log(error.response);
        
      console.error("Failed to search rides:", error);

      setRides([]);

      setError(
        error?.response?.data?.detail ||
          "Unable to search rides. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Ride</h1>

          <p className="mt-2 text-gray-600">
            Search for a ride that matches your journey.
          </p>
        </div>

        {/* Search Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
              {/* Source */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  From
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Enter source"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-black"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  To
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-black"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    // min={today}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-black"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Time
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="time"
                    // min={
                    //   travelDate === today
                    //     ? currentTime
                    //     : undefined
                    // }
                    value={travelTime}
                    onChange={(e) => setTravelTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-black"
                  />
                </div>
              </div>

              {/* Seats */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Seats
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    min="1"
                    value={seatRequired}
                    onChange={(e) => setSeatRequired(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none transition focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Search Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={18} />

                {loading ? "Searching..." : "Search Rides"}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="mt-8">
          {!loading && (
            <RideSearchList rides={rides} seatRequired={seatRequired} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchRides;
