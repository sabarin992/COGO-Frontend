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
import { createRide } from "../../services/rideService";
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

    // Step 3 - Date
    if (currentStep === 3) {
      if (!rideData.travel_date) {
        toast.error("Please select travel date.");
        return false;
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

  // Publish ride function
  const publishRide = async () => {
    try {
      setPublishing(true);

      const year = rideData.travel_date.getFullYear();
      const month = String(rideData.travel_date.getMonth() + 1).padStart(2, "0");
      const day = String(rideData.travel_date.getDate()).padStart(2, "0");

      const payload = {
        source: rideData.source,
        destination: rideData.destination,
        route: rideData.route,
        route_geometry: rideData.route_geometry,

        travel_date: `${year}-${month}-${day}`,

        travel_time: rideData.travel_time.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),

        available_seats: Number(rideData.available_seats),

        vehicle_id: rideData.vehicle_id,
      };

      console.log("Ride payload:", payload);

      const response = await createRide(payload);

      resetRideData();

      navigate("/ride/post-ride/success", {
        state: {
          ride: response,
        },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failure to publish ride.";

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
          title="Confirm Ride Offer?"
          message={`Are you sure you want to publish this ride offer from ${rideData.source} to ${rideData.destination}? Passengers will be able to search and request seats on this ride.`}
          confirmText={publishing ? "Publishing..." : "Yes, Publish Ride"}
          cancelText="Review Details"
          type="primary"
        />
      </div>
    </div>
  );
};

export default RideWizard;
