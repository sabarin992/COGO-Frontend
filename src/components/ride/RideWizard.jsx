import { useState } from "react";
import RideDetailsStep from "./RideDetailsStep";
import RouteSelectionStep from "./RouteSelectionStep";
import DateSelectionStep from "./DateSelectionStep";
import TimeSelectionStep from "./TimeSelectionStep";
import VehicleSelectionStep from "./VehicleSelectionStep";
import ReviewRideStep from "./ReviewRideStep";
import ProgressIndicator from "./ProgressIndicator";
import StepNavigation from "./StepNavigation";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useRide } from "../../context/RideContext";
import { createRide, createRecurringRide } from "../../services/rideService";
import { formatRecurrenceLabel } from "../../utils/recurrenceUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RideWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { rideData, resetRideData } = useRide();
  const [publishing, setPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const steps = [
    <RideDetailsStep key="details" />,
    <VehicleSelectionStep key="vehicle" />,
    <RouteSelectionStep key="route" />,
    <DateSelectionStep key="date" />,
    <TimeSelectionStep key="time" />,
    <ReviewRideStep key="review" />,
  ];

  const validateCurrentStep = () => {
    // Step 0 - Ride details
    if (currentStep === 0) {
      if (!rideData.source || !rideData.source.trim()) {
        toast.error("Please enter a source location.");
        return false;
      }

      if (!rideData.destination || !rideData.destination.trim()) {
        toast.error("Please enter a destination location.");
        return false;
      }

      if (!rideData.available_seats || rideData.available_seats <= 0) {
        toast.error("Available seats must be at least 1.");
        return false;
      }
    }

    // Step 1 - Vehicle
    if (currentStep === 1) {
      if (!rideData.vehicle_id) {
        toast.error("Please select a vehicle.");
        return false;
      }
    }

    // Step 2 - Route
    if (currentStep === 2) {
      if (!rideData.route) {
        toast.error("Please select a route.");
        return false;
      }
    }

    // Step 3 - Date & Recurrence
    if (currentStep === 3) {
      const isRecurring = rideData.recurrence_type && rideData.recurrence_type !== "ONCE";

      if (!isRecurring) {
        if (!rideData.travel_date) {
          toast.error("Please select travel date.");
          return false;
        }
      } else {
        if (!rideData.start_date) {
          toast.error("Please select recurrence start date.");
          return false;
        }
        if (!rideData.end_date) {
          toast.error("Please select recurrence end date.");
          return false;
        }
        if (rideData.start_date > rideData.end_date) {
          toast.error("Start date cannot be after end date.");
          return false;
        }
        const diffDays = Math.round((rideData.end_date - rideData.start_date) / (1000 * 60 * 60 * 24));
        if (diffDays > 90) {
          toast.error("Recurring schedule range cannot exceed 90 days.");
          return false;
        }

        if (rideData.recurrence_type === "SHIFT") {
          if (!rideData.working_days || rideData.working_days < 1) {
            toast.error("Working days must be at least 1.");
            return false;
          }
          if (!rideData.off_days || rideData.off_days < 1) {
            toast.error("Off days must be at least 1.");
            return false;
          }
          if (!rideData.shift_start_date) {
            toast.error("Please select shift pattern starting date.");
            return false;
          }
        }

        if (rideData.recurrence_type === "CUSTOM") {
          if (!rideData.selected_weekdays || rideData.selected_weekdays.length === 0) {
            toast.error("Please select at least one weekday for custom recurrence.");
            return false;
          }
        }
      }
    }

    // Step 4 - Time
    if (currentStep === 4) {
      if (!rideData.travel_time) {
        toast.error("Please select departure time.");
        return false;
      }
    }

    return true;
  };

  const formatDateToIso = (d) => {
    if (!d) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Publish ride function (handles both ONCE and recurring options)
  const publishRide = async () => {
    try {
      setPublishing(true);

      const formattedTime = rideData.travel_time.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const isRecurring = rideData.recurrence_type && rideData.recurrence_type !== "ONCE";

      if (!isRecurring) {
        // One-time ride: keep exact existing payload & endpoint
        const payload = {
          source: rideData.source,
          destination: rideData.destination,
          route: rideData.route,
          route_geometry: rideData.route_geometry,
          travel_date: formatDateToIso(rideData.travel_date),
          travel_time: formattedTime,
          available_seats: Number(rideData.available_seats),
          vehicle_id: rideData.vehicle_id,
        };

        const response = await createRide(payload);
        resetRideData();

        navigate("/ride/post-ride/success", {
          state: {
            ride: response,
          },
        });
      } else {
        // Recurring ride: submit to /recurring-rides
        const payload = {
          source: rideData.source,
          destination: rideData.destination,
          route: rideData.route,
          route_geometry: rideData.route_geometry,
          available_seats: Number(rideData.available_seats),
          vehicle_id: rideData.vehicle_id,
          travel_time: formattedTime,
          recurrence_type: rideData.recurrence_type,
          start_date: formatDateToIso(rideData.start_date || rideData.travel_date),
          end_date: formatDateToIso(rideData.end_date || rideData.travel_date),
          selected_weekdays: rideData.recurrence_type === "CUSTOM" ? rideData.selected_weekdays : null,
          working_days: rideData.recurrence_type === "SHIFT" ? Number(rideData.working_days) : null,
          off_days: rideData.recurrence_type === "SHIFT" ? Number(rideData.off_days) : null,
          shift_start_date:
            rideData.recurrence_type === "SHIFT"
              ? formatDateToIso(rideData.shift_start_date || rideData.start_date)
              : null,
        };

        const response = await createRecurringRide(payload);
        resetRideData();

        navigate("/ride/post-ride/success", {
          state: {
            recurringRide: response,
          },
        });
      }
    } catch (error) {
      console.error("Failed to publish ride:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failure to publish ride.";

      navigate("/ride/post-ride/failure", {
        state: {
          message,
        },
      });
    } finally {
      setPublishing(false);
    }
  };

  // Next button handler
  const nextStep = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === steps.length - 1) {
      setShowConfirmModal(true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleConfirmPublish = async () => {
    setShowConfirmModal(false);
    await publishRide();
  };

  // Previous button handler
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isRecurring = rideData.recurrence_type && rideData.recurrence_type !== "ONCE";

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Wizard Header Banner */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Offer a Ride
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Share your trip details and help fellow commuters travel together comfortably.
          </p>
        </div>

        {/* Progress Indicator Header */}
        <ProgressIndicator currentStep={currentStep} />

        {/* Step Component */}
        <div className="mt-4 transition-all duration-300">
          {steps[currentStep]}
        </div>

        {/* Navigation Bar */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          nextStep={nextStep}
          previousStep={previousStep}
          loading={publishing}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmPublish}
          title={isRecurring ? "Confirm Recurring Schedule?" : "Confirm Ride Offer?"}
          message={
            isRecurring
              ? `Are you sure you want to publish this recurring schedule (${formatRecurrenceLabel(
                  rideData.recurrence_type,
                  rideData.selected_weekdays,
                  rideData.working_days,
                  rideData.off_days
                )}) from ${rideData.source} to ${rideData.destination}? Individual independent rides will be generated for each scheduled journey date.`
              : `Are you sure you want to publish this ride offer from ${rideData.source} to ${rideData.destination}? Passengers will be able to search and request seats on this ride.`
          }
          confirmText={publishing ? "Publishing..." : isRecurring ? "Yes, Publish Schedule" : "Yes, Publish Ride"}
          cancelText="Review Details"
          type="primary"
        />
      </div>
    </div>
  );
};

export default RideWizard;
