"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProgressIndicator from "./ProgressIndicator";

interface ParentFormData {
  email: string;
  studentCode: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

const ParentForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ParentFormData>({
    email: "",
    studentCode: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleInputChange = (field: keyof ParentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Navigate to main register page on first step
      router.push("/auth/register");
    }
  };

  const handleSubmit = () => {
    console.log("Parent registration data:", formData);
    // Handle form submission here
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      custom={1}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200"
            placeholder="أدخل بريدك الإلكتروني"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            كود الطالب
          </label>
          <input
            type="text"
            value={formData.studentCode}
            onChange={(e) => handleInputChange("studentCode", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200"
            placeholder="أدخل كود الطالب"
          />
          <p className="text-sm text-gray-500 mt-1">
            يمكنك الحصول على كود الطالب من المدرسة
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      custom={1}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200"
            placeholder="أدخل كلمة المرور"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200"
            placeholder="أعد إدخال كلمة المرور"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      custom={1}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الجنس
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "ذكر", value: "male" },
            { label: "أنثى", value: "female" },
          ].map((option) => (
            <div
              key={option.value}
              onClick={() => handleInputChange("gender", option.value)}
              className={`cursor-pointer rounded-2xl border-2 p-4 text-center font-semibold transition-all duration-300 
          ${formData.gender === option.value
                  ? "border-[#ff751f] bg-[#ff751f]/10 text-[#ff751f] scale-105 shadow-sm"
                  : "border-gray-300 hover:border-[#ff751f]/50 hover:bg-gray-50"
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل ولي الأمر</h2>
          <p className="text-gray-600">أكمل البيانات التالية لإتمام التسجيل</p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={3} />

        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <motion.button
            onClick={prevStep}
            className="px-6 py-3 rounded-full font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            رجوع
          </motion.button>

          <motion.button
            onClick={currentStep === 3 ? handleSubmit : nextStep}
            className="px-6 py-3 bg-[#ff751f] text-white rounded-full font-medium hover:bg-[#da9752] transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === 3 ? "إنهاء التسجيل" : "التالي"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ParentForm;
