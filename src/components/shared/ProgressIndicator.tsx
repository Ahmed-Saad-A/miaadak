"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center w-full max-w-full">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <motion.div
                className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold
              ${isActive
                    ? 'bg-[#ff751f] text-white shadow-lg shadow-[#ff751f]/30'
                    : isCompleted
                      ? 'bg-[#ff751f] text-white'
                      : 'bg-[#d6d6d6] text-gray-500'
                  }`}
              >
                {stepNumber}
              </motion.div>

              {stepNumber < totalSteps && (
                <motion.div
                  className="flex-1 h-1 mx-2 rounded-full bg-gray-200"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
