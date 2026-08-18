import React from "react";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";

const StepNavigation = ({
  currentStep,
  totalSteps,
  nextStep,
  previousStep,
  loading = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="w-full max-w-4xl mx-auto flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
      {/* Back Button */}
      <button
        onClick={previousStep}
        disabled={currentStep === 0 || loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        <ChevronLeft size={18} />
        <span>Back</span>
      </button>

      {/* Step Counter Badge */}
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:block">
        Step {currentStep + 1} of {totalSteps}
      </span>

      {/* Next / Publish Button */}
      <button
        onClick={nextStep}
        disabled={loading}
        className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Publishing...</span>
          </>
        ) : isLastStep ? (
          <>
            <span>Publish Ride</span>
            <Send size={16} />
          </>
        ) : (
          <>
            <span>Next</span>
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
};

export default StepNavigation;