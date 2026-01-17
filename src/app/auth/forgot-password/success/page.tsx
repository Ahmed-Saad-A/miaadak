"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { AnimatedSide } from "@/components/shared";

const ForgotPasswordSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Success Message */}
          <div className="order-2 lg:order-1">
            <div className="w-full max-w-md mx-auto">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-20 h-20 bg-[#ff751f] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-[#ff751f]" />
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-4"
                >
                  تم إعادة تعيين كلمة المرور بنجاح!
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-600 mb-8"
                >
                  تم تغيير كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <Link href="/auth/login">
                    <motion.button
                      className="w-full px-6 py-3 bg-[#ff751f] text-white rounded-full font-medium hover:bg-[#da9752] transition-all duration-200 mb-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      تسجيل الدخول الآن
                    </motion.button>
                  </Link>

                  <Link href="/">
                    <motion.button
                      className="w-full px-6 py-3 bg-[#d6d6d6] text-gray-700 rounded-full font-medium hover:bg-[#fed59d] transition-all duration-200 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4 ml-2" />
                      العودة للصفحة الرئيسية
                    </motion.button>
                  </Link>
                </motion.div>
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

export default ForgotPasswordSuccessPage;
