import React from "react";
import { MapPin, Navigation, Calendar, Clock, Car, CheckCircle2 } from "lucide-react";

const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    { label: "Ride Details", icon: MapPin },
    { label: "Route", icon: Navigation },
    { label: "Date", icon: Calendar },
    { label: "Time", icon: Clock },
    { label: "Vehicle", icon: Car },
    { label: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background Track Line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
        
        {/* Progress Fill Line */}
        <div
          className="absolute top-5 left-6 h-0.5 bg-black transition-all duration-500 ease-in-out -z-0"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 96}%`,
          }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-black text-white shadow-md scale-105"
                    : isCurrent
                    ? "bg-black text-white ring-4 ring-gray-100 shadow-lg scale-110"
                    : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} className="text-white" />
                ) : (
                  <Icon size={18} className={isCurrent ? "text-white" : "text-gray-400"} />
                )}
              </div>

              <span
                className={`mt-2 text-xs font-medium text-center transition-colors ${
                  isCurrent
                    ? "text-black font-semibold"
                    : isCompleted
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;