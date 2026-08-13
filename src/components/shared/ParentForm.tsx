"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProgressIndicator from "./ProgressIndicator";
import { useRegistration } from "@/hooks";
import { USER_ROLES, GENDER, ParentFormData } from "@/interfaces";
import toast from "react-hot-toast";

// type ParentFormData = ParentFormData;

const ParentForm = () => {
  const router = useRouter();
  const TOTAL_STEPS = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ParentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: GENDER.MALE,
    address: "",
    birthDate: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerUser, isLoading, getFieldError, validateStep, validateField } = useRegistration({
    userRole: USER_ROLES.PARENT,
  });

  const handleInputChange = (field: keyof ParentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      const step1Data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        // userRole is automatically injected by validateStep
      };
      if (!validateStep(step1Data, 1)) {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
        return;
      }
    } else if (currentStep === 2) {
      const step2Data = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        // userRole is automatically injected by validateStep
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
    } else if (currentStep === 4) {
      const step4Data = {
        address: formData.address,
        birthDate: formData.birthDate,
      };
      if (!validateStep(step4Data, 4)) {
        toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
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

  const handleSubmit = async () => {
    const allValid =
      validateStep({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email }, 1) &&
      validateStep({ password: formData.password, confirmPassword: formData.confirmPassword }, 2) &&
      validateStep({ phoneNumber: formData.phoneNumber, gender: formData.gender }, 3) &&
      validateStep({ address: formData.address, birthDate: formData.birthDate }, 4);

    if (!allValid) {
      toast.error("يرجى تصحيح الأخطاء قبل الإرسال");
      return;
    }

    await registerUser(formData);
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
            className={`w-full px-4 py-3 outline-0 rounded-xl border transition-all duration-200 ${getFieldError("firstName")
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
            className={`w-full px-4 py-3 rounded-xl outline-0 border transition-all duration-200 ${getFieldError("lastName")
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
            className={`w-full px-4 py-3 rounded-xl outline-0 border transition-all duration-200 ${getFieldError("email")
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
              className={`w-full pr-4 pl-4 py-3 rounded-xl border outline-0 transition-all duration-200 ${getFieldError("password")
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
              className={`w-full pr-4 pl-4 py-3 rounded-xl outline-0 border transition-all duration-200 ${getFieldError("confirmPassword")
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رقم الهاتف
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          onBlur={(e) => validateField("phoneNumber", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl outline-0 border transition-all duration-200 ${getFieldError("phoneNumber")
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

    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
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
            العنوان
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            onBlur={(e) => validateField("address", e.target.value)}
            className={`w-full px-4 py-3 outline-0 rounded-xl border transition-all duration-200 ${getFieldError("address")
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل عنوانك"
          />
          {getFieldError("address") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("address")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ الميلاد
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
            onBlur={(e) => validateField("birthDate", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-3 outline-0 rounded-xl border transition-all duration-200 ${getFieldError("birthDate")
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
          />
          {getFieldError("birthDate") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("birthDate")}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل ولي الأمر</h2>
          <p className="text-gray-600">أكمل البيانات التالية لإتمام التسجيل</p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <motion.button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-full font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            رجوع
          </motion.button>

          <motion.button
            type="button"
            onClick={currentStep === TOTAL_STEPS ? handleSubmit : nextStep}
            disabled={isLoading}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ff751f] hover:bg-[#da9752]"
              } text-white`}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? "جاري التسجيل..." : (currentStep === TOTAL_STEPS ? "إنهاء التسجيل" : "التالي")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ParentForm;
