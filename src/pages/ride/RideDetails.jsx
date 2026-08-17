import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

import { getRideDetails } from "../../services/rideService";

const RideDetails = ({ mode }) => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const seatRequired = location.state?.seatRequired;

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSearchMode = mode === "search";
  
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRideDetails(rideId);

        setRide(data);
      } catch (error) {
        console.error("Failed to fetch ride details:", error);

        setError(
          error?.response?.data?.detail || "Unable to load ride details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleNext = () => {
    navigate(`/ride/${rideId}/review`, {
      state: {
        seatRequired,
        ride,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading ride details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ride) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Search Results
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ride Details</h1>

          <p className="mt-2 text-gray-600">
            Review the ride details before continuing.
          </p>
        </div>

        {/* Route */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Route
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">From</p>

                <p className="font-semibold text-gray-900">{ride.source}</p>
              </div>
            </div>

            <ArrowRight size={20} className="hidden text-gray-400 sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500">To</p>

                <p className="font-semibold text-gray-900">
                  {ride.destination}
                </p>
              </div>
            </div>
          </div>

          {ride.route && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-500">Route</p>

              <p className="mt-1 text-sm text-gray-700">{ride.route}</p>
            </div>
          )}
        </div>

        {/* Date & Seats */}
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <CalendarDays size={20} />
            </div>

            <p className="text-xs text-gray-500">Travel Date</p>

            <p className="mt-1 font-semibold text-gray-900">
              {formatDate(ride.travel_date)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Clock3 size={20} />
            </div>

            <p className="text-xs text-gray-500">Travel Time</p>

            <p className="mt-1 font-semibold text-gray-900">
              {formatTime(ride.travel_time)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Users size={20} />
            </div>

            <p className="text-xs text-gray-500">Available Seats</p>

            <p className="mt-1 font-semibold text-gray-900">
              {ride.available_seats}
            </p>
          </div>
        </div>

        {/* Driver */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Driver
          </p>

          <div className="flex items-center gap-4">
            {ride.driver.profile_pic ? (
              <img
                src={ride.driver.profile_pic}
                alt={ride.driver.full_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-600">
                {ride.driver.full_name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {ride.driver.full_name}
              </h2>

              <p className="text-sm text-gray-500">Ride Driver</p>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Car size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Vehicle
              </p>

              <h2 className="font-semibold text-gray-900">
                {ride.vehicle.brand} {ride.vehicle.model}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">Type</p>

              <p className="mt-1 font-medium text-gray-900">
                {ride.vehicle.vehicle_type}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Year</p>

              <p className="mt-1 font-medium text-gray-900">
                {ride.vehicle.year}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Color</p>

              <p className="mt-1 font-medium text-gray-900">
                {ride.vehicle.color}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Registration</p>

              <p className="mt-1 font-medium text-gray-900">
                {ride.vehicle.registration_number}
              </p>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Passengers
              </p>

              <h2 className="mt-1 text-lg font-semibold text-gray-900">
                Passengers on this ride
              </h2>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={18} />
              {ride.passengers.length}
            </div>
          </div>

          {ride.passengers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No passengers have joined this ride yet.
            </p>
          ) : (
            <div className="space-y-4">
              {ride.passengers.map((passenger) => (
                <div
                  key={passenger.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    {passenger.profile_pic ? (
                      <img
                        src={passenger.profile_pic}
                        alt={passenger.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                        {passenger.full_name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-gray-900">
                        {passenger.full_name}
                      </p>

                      <p className="text-xs text-gray-500">Passenger</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {passenger.seats_requested}{" "}
                    {passenger.seats_requested === 1 ? "seat" : "seats"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected seats + Next */}
        {isSearchMode && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Your Request
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {seatRequired || 1} {seatRequired === 1 ? "seat" : "seats"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Next
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   Car,
//   Clock3,
//   MapPin,
//   Users,
// } from "lucide-react";

// import { getRideDetails } from "../../services/rideService";

// const RideDetails = () => {
//   const { rideId } = useParams();
//   const navigate = useNavigate();

//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getRideDetails(rideId);

//         setRide(data);
//       } catch (error) {
//         console.error(
//           "Failed to fetch ride details:",
//           error
//         );

//         setError(
//           error?.response?.data?.detail ||
//             "Unable to load ride details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRideDetails();
//   }, [rideId]);

//   const formatDate = (date) => {
//     return new Date(
//       `${date}T00:00:00`
//     ).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatTime = (time) => {
//     return new Date(
//       `1970-01-01T${time}`
//     ).toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const handleNext = () => {
//     navigate(`/ride/${rideId}/review`);
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50">
//         <p className="text-gray-600">
//           Loading ride details...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
//         <div className="rounded-xl bg-white p-8 text-center shadow-sm">
//           <p className="text-red-600">{error}</p>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!ride) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-8">

//       <div className="mx-auto max-w-5xl">

//         {/* Back */}
//         <button
//           type="button"
//           onClick={() => navigate(-1)}
//           className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
//         >
//           <ArrowLeft size={18} />
//           Back to Search Results
//         </button>

//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Ride Details
//           </h1>

//           <p className="mt-2 text-gray-600">
//             Review the ride details before continuing.
//           </p>
//         </div>

//         {/* Route */}
//         <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

//           <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
//             Route
//           </p>

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
//                 <MapPin size={20} />
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   From
//                 </p>

//                 <p className="font-semibold text-gray-900">
//                   {ride.source}
//                 </p>
//               </div>
//             </div>

//             <ArrowRight
//               size={20}
//               className="hidden text-gray-400 sm:block"
//             />

//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
//                 <MapPin size={20} />
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500">
//                   To
//                 </p>

//                 <p className="font-semibold text-gray-900">
//                   {ride.destination}
//                 </p>
//               </div>
//             </div>

//           </div>

//           {ride.route && (
//             <div className="mt-5 border-t border-gray-100 pt-5">
//               <p className="text-xs text-gray-500">
//                 Route
//               </p>

//               <p className="mt-1 text-sm text-gray-700">
//                 {ride.route}
//               </p>
//             </div>
//           )}

//         </div>

//         {/* Date & Seats */}
//         <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

//           <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
//               <CalendarDays size={20} />
//             </div>

//             <p className="text-xs text-gray-500">
//               Travel Date
//             </p>

//             <p className="mt-1 font-semibold text-gray-900">
//               {formatDate(ride.travel_date)}
//             </p>
//           </div>

//           <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
//               <Clock3 size={20} />
//             </div>

//             <p className="text-xs text-gray-500">
//               Travel Time
//             </p>

//             <p className="mt-1 font-semibold text-gray-900">
//               {formatTime(ride.travel_time)}
//             </p>
//           </div>

//           <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
//               <Users size={20} />
//             </div>

//             <p className="text-xs text-gray-500">
//               Available Seats
//             </p>

//             <p className="mt-1 font-semibold text-gray-900">
//               {ride.available_seats}
//             </p>
//           </div>

//         </div>

//         {/* Driver */}
//         <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

//           <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
//             Driver
//           </p>

//           <div className="flex items-center gap-4">

//             {ride.driver.profile_pic ? (
//               <img
//                 src={ride.driver.profile_pic}
//                 alt={ride.driver.full_name}
//                 className="h-16 w-16 rounded-full object-cover"
//               />
//             ) : (
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-600">
//                 {ride.driver.full_name
//                   ?.charAt(0)
//                   ?.toUpperCase()}
//               </div>
//             )}

//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 {ride.driver.full_name}
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Ride Driver
//               </p>
//             </div>

//           </div>

//         </div>

//         {/* Vehicle */}
//         <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

//           <div className="mb-5 flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
//               <Car size={20} />
//             </div>

//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Vehicle
//               </p>

//               <h2 className="font-semibold text-gray-900">
//                 {ride.vehicle.brand}{" "}
//                 {ride.vehicle.model}
//               </h2>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

//             <div>
//               <p className="text-xs text-gray-500">
//                 Type
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {ride.vehicle.vehicle_type}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500">
//                 Year
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {ride.vehicle.year}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500">
//                 Color
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {ride.vehicle.color}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500">
//                 Registration
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {ride.vehicle.registration_number}
//               </p>
//             </div>

//           </div>

//         </div>

//         {/* Passengers */}
//         <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Passengers
//               </p>

//               <h2 className="mt-1 text-lg font-semibold text-gray-900">
//                 Passengers on this ride
//               </h2>
//             </div>

//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Users size={18} />
//               {ride.passengers.length}
//             </div>
//           </div>

//           {ride.passengers.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No passengers have joined this ride yet.
//             </p>
//           ) : (
//             <div className="space-y-4">

//               {ride.passengers.map((passenger) => (
//                 <div
//                   key={passenger.id}
//                   className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
//                 >

//                   <div className="flex items-center gap-3">

//                     {passenger.profile_pic ? (
//                       <img
//                         src={passenger.profile_pic}
//                         alt={passenger.full_name}
//                         className="h-10 w-10 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
//                         {passenger.full_name
//                           ?.charAt(0)
//                           ?.toUpperCase()}
//                       </div>
//                     )}

//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {passenger.full_name}
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         Passenger
//                       </p>
//                     </div>

//                   </div>

//                   <p className="text-sm text-gray-600">
//                     {passenger.seats_requested}{" "}
//                     {passenger.seats_requested === 1
//                       ? "seat"
//                       : "seats"}
//                   </p>

//                 </div>
//               ))}

//             </div>
//           )}

//         </div>

//         {/* Next */}
//         <div className="flex justify-end pb-8">

//           <button
//             type="button"
//             onClick={handleNext}
//             className="flex items-center gap-2 rounded-xl bg-black px-7 py-3 font-medium text-white transition hover:bg-gray-800"
//           >
//             Next
//             <ArrowRight size={18} />
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default RideDetails;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getRideById } from "../../services/rideService";

// const RideDetails = () => {
//   const { rideId } = useParams();

//   const [ride, setRide] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRide = async () => {
//       try {
//         const response = await getRideById(rideId);

//         setRide(response);
//       } catch (error) {
//         console.error("Failed to fetch ride:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRide();
//   }, [rideId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-80">
//         <p className="text-lg font-semibold text-gray-600">Loading ride...</p>
//       </div>
//     );
//   }

//   if (!ride) {
//     return (
//       <div className="flex justify-center items-center h-80">
//         <p className="text-lg font-semibold text-red-500">Ride not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-[1400px] mx-auto px-6 py-10">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-900">Ride Details</h1>

//         <p className="text-gray-500 mt-2">
//           View the details of your posted ride.
//         </p>
//       </div>

//       {/* Ride Details Card */}
//       <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
//         {/* Route Header */}
//         <div className="flex bg-black text-white px-8 py-7 justify-between">
//           <div>
//             <p className="text-sm text-gray-400 uppercase tracking-wider">
//               Route
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {ride.source} → {ride.destination}
//             </h2>
//           </div>
//           <div className="flex gap-3">
//             <h2 className="text-3xl font-bold mt-2 cursor-pointer" onClick={()=>{navigate(`/ride/my-rides/edit/${rideId}`)}}>
//               Edit
//             </h2>
//             <h2 className="text-3xl font-bold mt-2">
//               Delete
//             </h2>
//           </div>
//         </div>

//         {/* Details */}
//         <div className="p-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Date */}
//             <div>
//               <p className="text-sm text-gray-400 uppercase tracking-wider">
//                 Travel Date
//               </p>

//               <p className="text-lg font-semibold text-gray-900 mt-2">
//                 {ride.travel_date}
//               </p>
//             </div>

//             {/* Time */}
//             <div>
//               <p className="text-sm text-gray-400 uppercase tracking-wider">
//                 Travel Time
//               </p>

//               <p className="text-lg font-semibold text-gray-900 mt-2">
//                 {ride.travel_time}
//               </p>
//             </div>

//             {/* Seats */}
//             <div>
//               <p className="text-sm text-gray-400 uppercase tracking-wider">
//                 Available Seats
//               </p>

//               <p className="text-lg font-semibold text-gray-900 mt-2">
//                 {ride.available_seats}
//               </p>
//             </div>

//             {/* Route */}
//             <div className="md:col-span-2 lg:col-span-3">
//               <p className="text-sm text-gray-400 uppercase tracking-wider">
//                 Selected Route
//               </p>

//               <p className="text-lg font-semibold text-gray-900 mt-2">
//                 {ride.route || "No route information"}
//               </p>
//             </div>

//             {/* Vehicle */}
//             <div>
//               <p className="text-sm text-gray-400 uppercase tracking-wider">
//                 Vehicle
//               </p>

//               <p className="text-lg font-semibold text-gray-900 mt-2">
//                 Vehicle #{ride.vehicle_id}
//               </p>
//             </div>

//             {/* Ride ID */}
//             <div>
//               <p className="text-sm text-gray-400 uppercase tracking-wider">
//                 Ride ID
//               </p>

//               <p className="text-lg font-semibold text-gray-900 mt-2">
//                 #{ride.ride_id}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Back to my rides */}
//       <button
//         onClick={() => navigate("/ride/my-rides")}
//         className="mt-8 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition"
//       >
//         Back to My Rides
//       </button>
//     </div>
//   );
// };

// export default RideDetails;
