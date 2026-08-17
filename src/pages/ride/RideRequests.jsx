import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Clock3,
  User,
  Users,
  X,
} from "lucide-react";

import {
  getRideRequests,
  acceptRideRequest,
  rejectRideRequest,
} from "../../services/rideService";

const RideRequests = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRideRequests(rideId);

      setRequests(data);
    } catch (error) {
      console.error(
        "Failed to fetch ride requests:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to load ride requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [rideId]);

  const handleAccept = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");

      const updatedRequest =
        await acceptRideRequest(requestId);

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.ride_request_id === requestId
            ? {
                ...request,
                status: updatedRequest.status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Failed to accept ride request:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to accept the ride request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");

      const updatedRequest =
        await rejectRideRequest(requestId);

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.ride_request_id === requestId
            ? {
                ...request,
                status: updatedRequest.status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Failed to reject ride request:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          "Unable to reject the ride request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    if (status === "pending") {
      return "bg-yellow-50 text-yellow-700";
    }

    if (status === "accepted") {
      return "bg-green-50 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          Loading ride requests...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Ride Requests
          </h1>

          <p className="mt-2 text-gray-600">
            Manage passengers requesting to join your ride.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Users
                size={24}
                className="text-gray-500"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No ride requests
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No passengers have requested to join this ride yet.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {requests.map((request) => {
              const isProcessing =
                processingId ===
                request.ride_request_id;

              const isPending =
                request.status === "pending";

              return (
                <div
                  key={request.ride_request_id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                  {/* Passenger + Status */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      {request.passenger_profile_pic ? (
                        <img
                          src={
                            request.passenger_profile_pic
                          }
                          alt={request.passenger_name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600">
                          {request.passenger_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {request.passenger_name}
                        </h2>

                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <User size={15} />
                          Passenger
                        </div>
                      </div>

                    </div>

                    <span
                      className={`self-start rounded-full px-3 py-1.5 text-xs font-medium sm:self-auto ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                  </div>

                  {/* Request Details */}
                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                        <Users
                          size={18}
                          className="text-gray-600"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Seats Requested
                        </p>

                        <p className="font-medium text-gray-900">
                          {request.seats_requested}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                        <Clock3
                          size={18}
                          className="text-gray-600"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Requested At
                        </p>

                        <p className="font-medium text-gray-900">
                          {formatDate(
                            request.created_at
                          )}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleReject(
                            request.ride_request_id
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X size={17} />

                        {isProcessing
                          ? "Processing..."
                          : "Reject"}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleAccept(
                            request.ride_request_id
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check size={17} />

                        {isProcessing
                          ? "Processing..."
                          : "Accept"}
                      </button>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default RideRequests;