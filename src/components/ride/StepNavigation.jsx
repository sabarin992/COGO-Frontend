const StepNavigation = ({
  currentStep,
  totalSteps,
  nextStep,
  previousStep,
}) => {
  return (
    <div className="flex justify-between mt-10">

      <button
        onClick={previousStep}
        disabled={currentStep === 0}
        className="px-6 py-3 rounded-lg bg-gray-200 disabled:opacity-40"
      >
        Back
      </button>

      <button
        onClick={nextStep}
        disabled={currentStep === totalSteps - 1}
        className="px-6 py-3 rounded-lg bg-black text-white disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
};

export default StepNavigation;