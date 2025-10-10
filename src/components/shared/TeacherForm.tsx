"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProgressIndicator from "../shared/ProgressIndicator";
import { useRegistration } from "@/hooks";
import { USER_ROLES, GENDER } from "@/interfaces";
import toast from "react-hot-toast";

interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: number;
  specialization: string;
}

const TeacherForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: GENDER.MALE,
    specialization: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerUser, isLoading, getFieldError, validateStep, validateField } = useRegistration({
    userRole: USER_ROLES.TEACHER,
  });

  const handleInputChange = (field: keyof TeacherFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const step1Data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      if (!validateStep(step1Data, 1)) {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
        return;
      }
    } else if (currentStep === 2) {
      const step2Data = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      if (!validateStep(step2Data, 2)) {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
        return;
      }
    } else if (currentStep === 3) {
      const step3Data = {
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
      };
      if (!validateStep(step3Data, 3)) {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
        return;
      }
    }

    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };


  const handleSubmit = async () => {
    await registerUser(formData);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Navigate to main register page on first step
      router.push("/auth/register");
    }
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
            الاسم الأول
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            onBlur={(e) => validateField("firstName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("firstName")
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل اسمك الأول"
          />
          {getFieldError("firstName") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("firstName")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم الأخير
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            onBlur={(e) => validateField("lastName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("lastName")
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل اسمك الأخير"
          />
          {getFieldError("lastName") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("lastName")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={(e) => validateField("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("email")
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل بريدك الإلكتروني"
          />
          {getFieldError("email") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("email")}</p>
          )}
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={(e) => validateField("password", e.target.value)}
              className={`w-full pr-4 pl-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("password")
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
                }`}
              placeholder="أدخل كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 left-0 flex items-center pl-3 pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {getFieldError("password") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("password")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              onBlur={(e) => validateField("confirmPassword", e.target.value)}
              className={`w-full pr-4 pl-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("confirmPassword")
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
                }`}
              placeholder="أعد إدخال كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 left-0 flex items-center pl-3 pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {getFieldError("confirmPassword") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("confirmPassword")}</p>
          )}
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            onBlur={(e) => validateField("phoneNumber", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("phoneNumber")
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل رقم هاتفك"
          />
          {getFieldError("phoneNumber") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("phoneNumber")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الجنس
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "ذكر", value: GENDER.MALE },
              { label: "أنثى", value: GENDER.FEMALE },
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
          {getFieldError("gender") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("gender")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التخصص
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => handleInputChange("specialization", e.target.value)}
            onBlur={(e) => validateField("specialization", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${getFieldError("specialization")
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل التخصص"
          />
          {getFieldError("specialization") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("specialization")}</p>
          )}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل المعلم</h2>
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
            disabled={isLoading}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#ff751f] hover:bg-[#da9752]"
              } text-white`}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? "جاري التسجيل..." : (currentStep === 3 ? "إنهاء التسجيل" : "التالي")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherForm;
