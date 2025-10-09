"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AnimatedSide } from "@/components/shared";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = () => {
    if (email) {
      setCurrentStep(2);
    }
  };

  const handleVerificationSubmit = () => {
    if (verificationCode.every(digit => digit !== "")) {
      setCurrentStep(3);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const newCode = [...verificationCode];
    newCode[index] = value.replace(/\D/g, '').slice(0, 1);
    setVerificationCode(newCode);
    
    // Move to next empty field
    if (value && index < 5) {
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      setFocusedIndex(index - 1);
    }
  };

  const handlePasswordSubmit = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      // Handle password reset
      console.log("Password reset successful");
      // Navigate to success page
      router.push("/auth/forgot-password/success");
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#ff751f] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-[#ff751f]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h2>
        <p className="text-gray-600">أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200 text-right"
            placeholder="أدخل بريدك الإلكتروني"
          />
        </div>
      </div>

      <motion.button
        onClick={handleEmailSubmit}
        disabled={!email}
        className={`
          w-full px-6 py-3 rounded-full font-medium transition-all duration-200
          ${email 
            ? 'bg-[#ff751f] text-white hover:bg-[#da9752]' 
            : 'bg-[#d6d6d6] text-gray-500 cursor-not-allowed'
          }
        `}
        whileHover={email ? { scale: 1.02 } : {}}
        whileTap={email ? { scale: 0.98 } : {}}
      >
        تأكيد الإيميل
      </motion.button>
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#ff751f] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#ff751f]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تحقق من بريدك الإلكتروني</h2>
        <p className="text-gray-600">
          تم إرسال رمز التحقق إلى <span className="font-semibold text-[#ff751f]">{email}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">أدخل الرمز المكون من 6 أرقام في المربعات أدناه</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-6 text-center">
            أدخل رمز التحقق
          </label>
          
          {/* 6 Individual Square Boxes - Single Line Layout */}
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setFocusedIndex(index)}
                maxLength={1}
                className={`
                  w-12 h-12 text-center text-xl font-bold rounded-lg border-2 transition-all duration-200
                  ${focusedIndex === index
                    ? 'border-[#ff751f] ring-2 ring-[#ff751f] ring-opacity-20 bg-white'
                    : digit
                    ? 'border-[#ff751f] bg-[#ff751f] text-white'
                    : 'border-[#d6d6d6] bg-white text-gray-400'
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#ff751f] focus:ring-opacity-20
                `}
              />
            ))}
          </div>

          {/* Clear Button */}
          {verificationCode.some(digit => digit !== "") && (
            <div className="text-center mt-6">
              <motion.button
                onClick={() => {
                  setVerificationCode(["", "", "", "", "", ""]);
                  setFocusedIndex(0);
                }}
                className="text-[#ff751f] hover:text-[#da9752] text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                مسح الكود
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <motion.button
        onClick={handleVerificationSubmit}
        disabled={!verificationCode.every(digit => digit !== "")}
        className={`
          w-full px-6 py-3 rounded-full font-medium transition-all duration-200
          ${verificationCode.every(digit => digit !== "")
            ? 'bg-[#ff751f] text-white hover:bg-[#da9752]' 
            : 'bg-[#d6d6d6] text-gray-500 cursor-not-allowed'
          }
        `}
        whileHover={verificationCode.every(digit => digit !== "") ? { scale: 1.02 } : {}}
        whileTap={verificationCode.every(digit => digit !== "") ? { scale: 0.98 } : {}}
      >
        تأكيد الرمز
      </motion.button>
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#ff751f] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#ff751f]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">إنشاء كلمة مرور جديدة</h2>
        <p className="text-gray-600">أدخل كلمة المرور الجديدة</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            كلمة المرور الجديدة
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200 text-right"
            placeholder="أدخل كلمة المرور الجديدة"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff751f] focus:ring-2 focus:ring-[#ff751f]/20 transition-all duration-200 text-right"
            placeholder="أعد إدخال كلمة المرور"
          />
        </div>
      </div>

      <motion.button
        onClick={handlePasswordSubmit}
        disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
        className={`
          w-full px-6 py-3 rounded-full font-medium transition-all duration-200
          ${newPassword && confirmPassword && newPassword === confirmPassword
            ? 'bg-[#ff751f] text-white hover:bg-[#da9752]' 
            : 'bg-[#d6d6d6] text-gray-500 cursor-not-allowed'
          }
        `}
        whileHover={newPassword && confirmPassword && newPassword === confirmPassword ? { scale: 1.02 } : {}}
        whileTap={newPassword && confirmPassword && newPassword === confirmPassword ? { scale: 0.98 } : {}}
      >
        إعادة تعيين كلمة المرور
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Forgot Password Form */}
          <div className="order-2 lg:order-1">
            <div className="w-full max-w-md mx-auto">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                {/* Back Button */}
                <motion.button
                  onClick={() => router.push("/auth/login")}
                  className="flex items-center text-gray-600 hover:text-[#ff751f] transition-colors mb-6"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة لتسجيل الدخول
                </motion.button>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <motion.div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                            ${currentStep >= step 
                              ? 'bg-[#ff751f] text-white' 
                              : 'bg-[#d6d6d6] text-gray-500'
                            }
                          `}
                          animate={currentStep === step ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                          {step}
                        </motion.div>
                        {step < 3 && (
                          <motion.div
                            className="w-8 h-1 mx-2"
                            animate={{ 
                              backgroundColor: currentStep > step ? '#ff751f' : '#d6d6d6'
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
          
          {/* Right side - Animated Side */}
          <div className="order-1 lg:order-2">
            <AnimatedSide />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
