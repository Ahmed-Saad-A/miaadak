"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedSide } from "@/components/shared";

const RegisterPage = () => {
  const registrationTypes = [
    {
      title: "تسجيل المعلم",
      description: "سجل كمعلم للوصول إلى لوحة التحكم التعليمية",
      href: "/auth/register/teacher",
      icon: "👨‍🏫",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "تسجيل الطالب",
      description: "سجل كطالب للوصول إلى المحتوى التعليمي",
      href: "/auth/register/student",
      icon: "👨‍🎓",
      color: "from-green-500 to-green-600"
    },
    {
      title: "تسجيل ولي الأمر",
      description: "سجل كولي أمر لمتابعة تقدم طفلك",
      href: "/auth/register/parent",
      icon: "👨‍👩‍👧‍👦",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Registration Options */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">اختر نوع التسجيل</h1>
                <p className="text-gray-600">اختر نوع الحساب الذي تريد إنشاؤه</p>
              </div>

              <div className="space-y-4">
                {registrationTypes.map((type, index) => (
                  <motion.div
                    key={type.href}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={type.href}>
                      <motion.div
                        className={`
                          p-6 rounded-xl border-2 border-gray-200 hover:border-[#00FF9C] 
                          transition-all duration-300 cursor-pointer group
                          bg-gradient-to-r ${type.color} bg-opacity-5 hover:bg-opacity-10
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="text-3xl">{type.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#00FF9C] transition-colors">
                              {type.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {type.description}
                            </p>
                          </div>
                          <motion.div
                            className="text-gray-400 group-hover:text-[#00FF9C] transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            ←
                          </motion.div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  لديك حساب بالفعل؟{" "}
                  <Link href="/auth/login" className="text-[#00FF9C] hover:underline font-medium">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </motion.div>
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

export default RegisterPage;
