import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

const RideFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const errorMessage =
    location.state?.message ||
    "We couldn't publish your ride at the moment. Please try again.";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Failure Message */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle
              size={36}
              className="text-red-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Ride Publication Failed
          </h1>

          <p className="mx-auto mt-2 max-w-md text-gray-600">
            We were unable to publish your ride. Please check your ride
            details and try again.
          </p>

          {/* Status */}
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
            <AlertTriangle size={16} />
            Ride Not Published
          </div>
        </div>

        {/* Error Information */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            What happened?
          </p>

          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm leading-6 text-red-700">
              {errorMessage}
            </p>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Your ride has not been published. You can return to the ride
            posting process and try again.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">

          {/* Go Back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              Go Back
            </span>
          </button>

          {/* Try Again */}
          <button
            type="button"
            onClick={() => navigate("/ride/post-ride")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
};

export default RideFailure;