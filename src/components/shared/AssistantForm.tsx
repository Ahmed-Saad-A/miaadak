"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressIndicator from "./ProgressIndicator";
import { useRegistration } from "@/hooks";
import { USER_ROLES, GENDER } from "@/interfaces";
import toast from "react-hot-toast";
import { servicesApi } from "@/services/authApi";
import { AssistantFormData } from "@/interfaces/assistant";
import { useSession } from "next-auth/react";

interface AssistantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TOTAL_STEPS = 4;

const AssistantForm = ({ onSuccess, onCancel }: AssistantFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: session } = useSession();

  const userId = session?.user?.userId;

  const [formData, setFormData] = useState<AssistantFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: GENDER.MALE,
    address: "",
    birthDate: "",
    teacherId: userId || "",
    canManageStudents: false,
    canManageSessions: false,
    canManageAttendance: false,
    canManageExams: false,
  });

  useEffect(() => {
    if (userId) {
      setFormData(prev => ({ ...prev, teacherId: userId }));
    }
  }, [userId]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    registerUser,
    isLoading,
    validateStep,
    validateField,
    getFieldError,
  } = useRegistration({
    userRole: USER_ROLES.ASSISTANT,
  });

  const handleInputChange = (
    field: keyof AssistantFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    let valid = false;

    if (currentStep === 1) {
      valid = validateStep(
        { firstName: formData.firstName, lastName: formData.lastName, email: formData.email },
        1
      );
    } else if (currentStep === 2) {
      valid = validateStep(
        { password: formData.password, confirmPassword: formData.confirmPassword },
        2
      );
    } else if (currentStep === 3) {
      valid = validateStep(
        {
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          address: formData.address,
          birthDate: formData.birthDate
        },
        3
      );
    } else if (currentStep === 4) {
      valid = validateStep(
        {
          canManageStudents: formData.canManageStudents,
          canManageSessions: formData.canManageSessions,
          canManageAttendance: formData.canManageAttendance,
          canManageExams: formData.canManageExams,
        },
        4
      );
    }

    if (!valid) {
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const step1Valid = validateStep(
      { firstName: formData.firstName, lastName: formData.lastName, email: formData.email },
      1
    );

    const step2Valid = validateStep(
      { password: formData.password, confirmPassword: formData.confirmPassword },
      2
    );

    const step3Valid = validateStep(
      {
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        address: formData.address,
        birthDate: formData.birthDate
      },
      3
    );


    const step4Valid = true;

    console.log("Validation Results:", { step1Valid, step2Valid, step3Valid, step4Valid });

    if (!step1Valid || !step2Valid || !step3Valid) {
      toast.error("يرجى تصحيح الأخطاء قبل الإرسال");
      return;
    }

    const success = await servicesApi.registerAssistant(formData);
    if (success && onSuccess) {
      onSuccess();
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

  /* -------------------- UI Steps -------------------- */

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
            placeholder="أدخل الاسم الأول"
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
            placeholder="أدخل الاسم الأخير"
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
            placeholder="أدخل البريد الإلكتروني"
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
            className={`w-full px-4 py-3 rounded-xl outline-0 border transition-all duration-200 ${getFieldError("phoneNumber")
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20"
              }`}
            placeholder="أدخل رقم الهاتف"
          />
          {getFieldError("phoneNumber") && (
            <div className="flex items-start gap-2 mt-2">
              {/* ✅ علامة X واضحة */}
              <span className="text-red-500 text-lg flex-shrink-0">✕</span>
              <p className="text-red-500 text-sm flex-1">{getFieldError("phoneNumber")}</p>
            </div>
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
            <div className="flex items-start gap-2 mt-2">
              <span className="text-red-500 text-lg flex-shrink-0">✕</span>
              <p className="text-red-500 text-sm flex-1">{getFieldError("gender")}</p>
            </div>
          )}
        </div>

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
            placeholder="أدخل العنوان"
          />
          {getFieldError("address") && (
            <div className="flex items-start gap-2 mt-2">
              <span className="text-red-500 text-lg flex-shrink-0">✕</span>
              <p className="text-red-500 text-sm flex-1">{getFieldError("address")}</p>
            </div>
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
            <div className="flex items-start gap-2 mt-2">
              <span className="text-red-500 text-lg flex-shrink-0">✕</span>
              <p className="text-red-500 text-sm flex-1">{getFieldError("birthDate")}</p>
            </div>
          )}
        </div>
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
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          الصلاحيات الممنوحة
        </label>

        {[
          { key: "canManageStudents", label: "إدارة الطلاب", icon: "👥" },
          { key: "canManageSessions", label: "إدارة الحصص", icon: "📚" },
          { key: "canManageAttendance", label: "إدارة الحضور", icon: "✅" },
          { key: "canManageExams", label: "إدارة الامتحانات", icon: "📝" },
        ].map((permission) => (
          <div
            key={permission.key}
            onClick={() =>
              handleInputChange(
                permission.key as keyof AssistantFormData,
                !formData[permission.key as keyof AssistantFormData]
              )
            }
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData[permission.key as keyof AssistantFormData]
              ? "border-[#ff751f] bg-[#ff751f]/10 scale-105 shadow-sm"
              : "border-gray-300 hover:border-[#ff751f]/50 hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{permission.icon}</span>
              <span
                className={`font-semibold ${formData[permission.key as keyof AssistantFormData]
                  ? "text-[#ff751f]"
                  : "text-gray-700"
                  }`}
              >
                {permission.label}
              </span>
            </div>
          </div>
        ))}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">إضافة مساعد جديد</h2>
          <p className="text-gray-600">أكمل البيانات التالية لإنشاء حساب المساعد</p>
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
            onClick={prevStep}
            className="px-6 py-3 rounded-full font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === 1 ? "إلغاء" : "رجوع"}
          </motion.button>

          <motion.button
            onClick={currentStep === TOTAL_STEPS ? handleSubmit : nextStep}
            disabled={isLoading}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#ff751f] hover:bg-[#da9752]"
              } text-white`}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading
              ? "جاري الحفظ..."
              : currentStep === TOTAL_STEPS
                ? "إنهاء وحفظ"
                : "التالي"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssistantForm;