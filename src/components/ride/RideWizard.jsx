import { useState } from "react";

import RideDetailsStep from "./RideDetailsStep";
import RouteSelectionStep from "./RouteSelectionStep";
import DateSelectionStep from "./DateSelectionStep";
import TimeSelectionStep from "./TimeSelectionStep";
import VehicleSelectionStep from "./VehicleSelectionStep";
import ReviewRideStep from "./ReviewRideStep";

const RideWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    <RideDetailsStep />,
    <RouteSelectionStep />,
    <DateSelectionStep />,
    <TimeSelectionStep />,
    <VehicleSelectionStep />,
    <ReviewRideStep />,
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {steps[currentStep]}
    </div>
  );
};

export default RideWizard;