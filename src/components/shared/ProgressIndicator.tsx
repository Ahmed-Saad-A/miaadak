"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-[#00FF9C] text-white shadow-lg shadow-[#00FF9C]/30' 
                    : isCompleted 
                    ? 'bg-[#00FF9C] text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                {stepNumber}
              </motion.div>
              
              {/* Connecting Line */}
              {stepNumber < totalSteps && (
                <motion.div
                  className="w-16 h-1 bg-gray-200 mx-2"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isCompleted ? 64 : 0,
                    backgroundColor: isCompleted ? '#00FF9C' : '#e5e7eb'
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
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
