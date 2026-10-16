
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Calendar, Clock, Users, Loader2 } from "lucide-react";

import { searchRides } from "../../services/rideService";
import RideSearchList from "../../components/ride/RideSearchList";
import SearchBox from "../../components/common/SearchBox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const SearchRides = () => {
  const [searchParams] = useSearchParams();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState(null);
  const [seatRequired, setSeatRequired] = useState(1);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Prevent duplicate automatic searches in React Strict Mode.
  const lastAutoSearch = useRef("");

  // Convert a location name into [longitude, latitude].
  const geocodeLocation = useCallback(async (query) => {
    if (!query || !MAPBOX_TOKEN) return null;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );

      if (!res.ok) {
        throw new Error("Location lookup failed.");
      }

      const data = await res.json();

      if (data.features?.length > 0) {
        return data.features[0].geometry.coordinates;
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }

    return null;
  }, []);

  // Perform the actual ride search.
  const performSearch = useCallback(async ({
    source: sourceValue,
    destination: destinationValue,
    travelDate: dateValue,
    travelTime: timeValue,
    seatRequired: seatsValue,
  }) => {
    setError("");

    if (!sourceValue?.trim()) {
      setError("Please enter your starting location.");
      return;
    }

    if (!destinationValue?.trim()) {
      setError("Please enter your destination.");
      return;
    }

    if (!dateValue) {
      setError("Please select a travel date.");
      return;
    }

    if (!Number.isInteger(seatsValue) || seatsValue < 1 || seatsValue > 8) {
      setError("Please select between 1 and 8 seats.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Geocode both locations.
      const [sourceCoords, destinationCoords] = await Promise.all([
        geocodeLocation(sourceValue.trim()),
        geocodeLocation(destinationValue.trim()),
      ]);

      if (!sourceCoords) {
        setRides([]);
        setError("Unable to find the starting location.");
        return;
      }

      if (!destinationCoords) {
        setRides([]);
        setError("Unable to find the destination location.");
        return;
      }

      // Prepare the backend search payload.
      const searchData = {
        source: sourceValue.trim(),
        destination: destinationValue.trim(),
        source_coords: sourceCoords,
        destination_coords: destinationCoords,
        travel_date: dateValue,
        travel_time: timeValue || null,
        seat_required: seatsValue,
      };

      console.log("========== SEARCH DATA ==========");
      console.log(searchData);
      console.log("=================================");

      const data = await searchRides(searchData);

      setRides(data || []);
    } catch (err) {
      console.error("Failed to search rides:", err);

      setRides([]);

      if (err?.response?.status === 404) {
        // No matching rides.
        setError("");
      } else {
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            "Unable to search rides. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [geocodeLocation]);

  // Read URL parameters and automatically search on page entry.
  useEffect(() => {
    const queryString = searchParams.toString();

    // Avoid automatic searching when the page has no search parameters.
    if (!queryString) return;

    // Prevent duplicate searches for the same URL.
    if (lastAutoSearch.current === queryString) return;
    lastAutoSearch.current = queryString;

    const params = new URLSearchParams(queryString);

    const initialSource = params.get("source") || "";
    const initialDestination = params.get("destination") || "";
    const initialDate = params.get("travel_date") || "";
    const initialTime = params.get("travel_time") || null;
    const parsedSeats = Number(params.get("seat_required") || 1);
    const initialSeats =
      Number.isInteger(parsedSeats) && parsedSeats >= 1 && parsedSeats <= 8
        ? parsedSeats
        : 1;

    // Populate the search form.
    setSource(initialSource);
    setDestination(initialDestination);
    setTravelDate(initialDate);
    setTravelTime(initialTime);
    setSeatRequired(initialSeats);

    // Start searching without requiring another button click.
    if (
      initialSource.trim() &&
      initialDestination.trim() &&
      initialDate
    ) {
      performSearch({
        source: initialSource,
        destination: initialDestination,
        travelDate: initialDate,
        travelTime: initialTime,
        seatRequired: initialSeats,
      });
    }
  }, [searchParams, performSearch]);

  // Search when the user submits the form manually.
  const handleSearch = async (e) => {
    e.preventDefault();

    await performSearch({
      source,
      destination,
      travelDate,
      travelTime,
      seatRequired,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Hero Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Find Your Ride
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Search for available rides matching your journey, schedule, and seat
            requirements.
          </p>
        </div>

        {/* Search Card */}
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">

              {/* Source */}
              <SearchBox
                label="From"
                name="source"
                value={source}
                onChange={setSource}
                placeholder="Where from?"
              />

              {/* Destination */}
              <SearchBox
                label="To"
                name="destination"
                value={destination}
                onChange={setDestination}
                placeholder="Where to?"
              />

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Departure Time */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Time
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <input
                    type="time"
                    value={travelTime || ""}
                    onChange={(e) => setTravelTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Seats */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Seats Needed
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={seatRequired}
                    onChange={(e) =>
                      setSeatRequired(Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-600 border border-red-100"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Search Rides</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm flex flex-col items-center">
              <Loader2
                size={36}
                className="animate-spin text-black mb-3"
              />
              <p className="text-gray-600 font-medium text-sm">
                Searching for matching rides...
              </p>
            </div>
          ) : (
            searched && (
              <RideSearchList
                rides={rides}
                seatRequired={seatRequired}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchRides;


// import React, { useState } from "react";
// import { Search, Calendar, Clock, Users, Loader2 } from "lucide-react";
// import { searchRides } from "../../services/rideService";
// import RideSearchList from "../../components/ride/RideSearchList";
// import SearchBox from "../../components/common/SearchBox";

// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// const SearchRides = () => {
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [travelDate, setTravelDate] = useState("");
//   const [travelTime, setTravelTime] = useState(null);
//   const [seatRequired, setSeatRequired] = useState(1);

//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [searched, setSearched] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!source.trim()) {
//       setError("Please enter your starting location.");
//       return;
//     }

//     if (!destination.trim()) {
//       setError("Please enter your destination.");
//       return;
//     }

//     if (!travelDate) {
//       setError("Please select a travel date.");
//       return;
//     }

//     if (seatRequired < 1) {
//       setError("At least one seat is required.");
//       return;
//     }

//     // Get passenger source coordinates
//     const sourceCoords = await geocodeLocation(source.trim());

//     // Get passenger destination coordinates
//     const destinationCoords = await geocodeLocation(destination.trim());

//     console.log("Passenger source:", source.trim());

//     console.log("Passenger source coordinates:", sourceCoords);

//     console.log("Passenger destination:", destination.trim());

//     console.log("Passenger destination coordinates:", destinationCoords);

//     // Make sure both locations were found
//     if (!sourceCoords) {
//       setError("Unable to find the starting location.");
//       return;
//     }

//     if (!destinationCoords) {
//       setError("Unable to find the destination location.");
//       return;
//     }

//     // Search payload
//     const searchData = {
//       source: source.trim(),
//       destination: destination.trim(),

//       source_coords: sourceCoords,
//       destination_coords: destinationCoords,

//       travel_date: travelDate,
//       travel_time: travelTime,
//       seat_required: seatRequired,
//     };

//     console.log("========== SEARCH DATA ==========");
//     console.log(searchData);
//     console.log("=================================");

//     try {
//       setLoading(true);
//       setSearched(true);

//       const data = await searchRides(searchData);

//       setRides(data || []);
//     } catch (err) {
//       if (err?.response?.status === 404) {
//         setRides([]);
//       } else {
//         console.error("Failed to search rides:", err);

//         setRides([]);

//         setError(
//           err?.response?.data?.detail ||
//             err?.response?.data?.message ||
//             "Unable to search rides. Please try again.",
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const geocodeLocation = async (query) => {
//     if (!query || !MAPBOX_TOKEN) return null;

//     try {
//       const res = await fetch(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           query,
//         )}.json?access_token=${MAPBOX_TOKEN}&limit=1`,
//       );

//       const data = await res.json();

//       if (data.features && data.features.length > 0) {
//         return data.features[0].geometry.coordinates;
//       }
//     } catch (error) {
//       console.error("Geocoding failed:", error);
//     }

//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6">
//       <div className="mx-auto max-w-6xl">
//         {/* Hero Header */}
//         <div className="mb-8 text-center sm:text-left">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
//             Find Your Ride
//           </h1>
//           <p className="mt-2 text-sm sm:text-base text-gray-600">
//             Search for available rides matching your journey, schedule, and seat
//             requirements.
//           </p>
//         </div>

//         {/* Search Card */}
//         <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
//           <form onSubmit={handleSearch}>
//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
//               {/* Source */}
//               <SearchBox
//                 label="From"
//                 name="source"
//                 value={source}
//                 onChange={(val) => setSource(val)}
//                 placeholder="Where from?"
//               />

//               {/* Destination */}
//               <SearchBox
//                 label="To"
//                 name="destination"
//                 value={destination}
//                 onChange={(val) => setDestination(val)}
//                 placeholder="Where to?"
//               />

//               {/* Date */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Date <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Calendar
//                     size={18}
//                     className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                   />
//                   <input
//                     type="date"
//                     value={travelDate}
//                     onChange={(e) => setTravelDate(e.target.value)}
//                     className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
//                   />
//                 </div>
//               </div>

//               {/* Departure Time */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Time
//                 </label>
//                 <div className="relative">
//                   <Clock
//                     size={18}
//                     className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                   />
//                   <input
//                     type="time"
//                     value={travelTime || ""}
//                     onChange={(e) => setTravelTime(e.target.value)}
//                     className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
//                   />
//                 </div>
//               </div>

//               {/* Seats */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Seats Needed
//                 </label>
//                 <div className="relative">
//                   <Users
//                     size={18}
//                     className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                   />
//                   <input
//                     type="number"
//                     min="1"
//                     max="8"
//                     value={seatRequired}
//                     onChange={(e) => setSeatRequired(Number(e.target.value))}
//                     className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-600 border border-red-100">
//                 {error}
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     <span>Searching...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Search size={18} />
//                     <span>Search Rides</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Results Container */}
//         <div className="mt-8">
//           {loading ? (
//             <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm flex flex-col items-center">
//               <Loader2 size={36} className="animate-spin text-black mb-3" />
//               <p className="text-gray-600 font-medium text-sm">
//                 Searching for matching rides...
//               </p>
//             </div>
//           ) : (
//             searched && (
//               <RideSearchList rides={rides} seatRequired={seatRequired} />
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchRides;
