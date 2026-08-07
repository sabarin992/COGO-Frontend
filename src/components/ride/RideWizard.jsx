import { useState } from "react";

import RideDetailsStep from "./RideDetailsStep";
import RouteSelectionStep from "./RouteSelectionStep";
import DateSelectionStep from "./DateSelectionStep";
import TimeSelectionStep from "./TimeSelectionStep";
import VehicleSelectionStep from "./VehicleSelectionStep";
import ReviewRideStep from "./ReviewRideStep";
import ProgressIndicator from "./ProgressIndicator";
import StepNavigation from "./StepNavigation";
import { useRide } from "../../context/RideContext";
import { createRide } from "../../services/rideService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RideWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();

  const { rideData, resetRideData } = useRide();

  const [publishing, setPublishing] = useState(false);

  const steps = [
    <RideDetailsStep />,
    <RouteSelectionStep />,
    <DateSelectionStep />,
    <TimeSelectionStep />,
    <VehicleSelectionStep />,
    <ReviewRideStep />,
  ];

  if (currentStep === 3) {
    if (!rideData.travel_date) {
      alert("Please select travel date.");

      return false;
    }
  }

  if (currentStep === 4) {
    if (!rideData.travel_time) {
      alert("Please select departure time.");
      return false;
    }
  }

  if (currentStep === 5) {
    if (!rideData.vehicle_id) {
      alert("Please select a vehicle.");

      return false;
    }
  }

  //   field validation for source, destination and seat availabilty

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!rideData.source.trim()) {
        alert("Please enter source.");

        return false;
      }

      if (!rideData.destination.trim()) {
        alert("Please enter destination.");

        return false;
      }

      if (rideData.available_seats <= 0) {
        alert("Available seats must be greater than zero.");

        return false;
      }
    }

    if (currentStep === 1) {
      if (!rideData.route) {
        alert("Please select a route.");

        return false;
      }
    }

    return true;
  };

  //   publish ride function
  const publishRide = async () => {
    try {
      setPublishing(true);

      const payload = {
        source: rideData.source,
        destination: rideData.destination,
        route: rideData.route,

        travel_date: rideData.travel_date.toISOString().split("T")[0],

        travel_time: rideData.travel_time.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),

        available_seats: Number(rideData.available_seats),

        vehicle_id: rideData.vehicle_id,
      };

      await createRide(payload);

      resetRideData();

      navigate("/ride/post-ride/success");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failure to Publish ride");


    } finally {
      setPublishing(false);
    }
  };

  //   next button
  const nextStep = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === steps.length - 1) {
      await publishRide();

      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  //   previous button
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-6">
      <ProgressIndicator currentStep={currentStep} />

      {steps[currentStep]}

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        previousStep={previousStep}
        loading={publishing}
      />
    </div>
  );
};

export default RideWizard;
