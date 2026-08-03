import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Car, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  let isAuthenticated = false;

  try {
    const auth = useAuth();
    isAuthenticated = auth?.isAuthenticated || false;
  } catch (e) {
    // Fallback if rendered outside AuthProvider
    isAuthenticated = false;
  }

  const handleBookRide = () => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col justify-between sm:px-6 lg:px-10 select-none">
      {/* Top Header Navigation */}
      {/* <header className="mx-auto max-w-5xl w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-black">
            COGO
          </span>
        </Link>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </header> */}

      {/* Main Simple 404 Card */}
      <main className="mx-auto max-w-md w-full text-center py-12 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm my-auto">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gray-100 text-gray-900 border border-gray-200">
          <MapPin className="h-8 w-8" />
        </div>

        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
          Error 404
        </span>

        <h1 className="text-6xl font-black tracking-tight text-black sm:text-7xl mb-3">
          404
        </h1>

        <h2 className="text-xl font-bold text-gray-900 mb-2 sm:text-2xl">
          Oops! This route doesn&apos;t exist.
        </h2>

        <p className="text-xs sm:text-sm leading-relaxed text-gray-500 mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for may have been removed, renamed, or
          never existed. Let&apos;s get you back on the road.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
          >
            Go Home
          </Link>

          <button
            type="button"
            onClick={handleBookRide}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer"
          >
            <Car className="h-4 w-4" />
            Book a Ride
          </button>
        </div>
      </main>

      {/* Footer reassurance */}
      <footer className="text-center py-4">
        <p className="text-xs text-gray-500">
          Lost? Don&apos;t worry—we&apos;ll help you find your next ride.
        </p>
      </footer>
    </div>
  );
}
