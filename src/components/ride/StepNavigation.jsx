import React from "react";

const StepNavigation = ({
  currentStep,
  totalSteps,
  nextStep,
  previousStep,
  loading = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center mt-10">
      {/* Back Button */}
      <button
        onClick={previousStep}
        disabled={currentStep === 0 || loading}
        className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>

      {/* Next / Publish Button */}
      <button
        onClick={nextStep}
        disabled={loading}
        className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Publishing..."
          : isLastStep
          ? "Publish Ride"
          : "Next"}
      </button>
    </div>
  );
};

export default StepNavigation;