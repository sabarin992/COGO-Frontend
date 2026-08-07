const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    "Ride Details",
    "Route",
    "Date",
    "Time",
    "Vehicle",
    "Review",
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">

        {steps.map((step, index) => (
          <div
            key={index}
            className="flex-1 flex items-center"
          >

            <div className="flex flex-col items-center">

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${
                    index < currentStep
                      ? "bg-green-600 text-white"
                      : index === currentStep
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>

              <span
                className={`mt-2 text-sm text-center
                ${
                  index === currentStep
                    ? "font-semibold text-black"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>

            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2
                ${
                  index < currentStep
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default ProgressIndicator;