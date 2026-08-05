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

const RideWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { rideData } = useRide();

  const steps = [
    <RideDetailsStep />,
    <RouteSelectionStep />,
    <DateSelectionStep />,
    <TimeSelectionStep />,
    <VehicleSelectionStep />,
    <ReviewRideStep />,
  ];

  //   field validation

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


  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <ProgressIndicator currentStep={currentStep} />

      {steps[currentStep]}

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    </div>
  );
};

export default RideWizard;
