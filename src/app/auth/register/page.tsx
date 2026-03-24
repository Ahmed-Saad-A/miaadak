"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedSide } from "@/components/shared";
import { User, GraduationCap, Users } from "lucide-react";

const RegisterPage = () => {
  const registrationTypes = [
    {
      title: "تسجيل المعلم",
      description: "انضم كمعلم لإدارة الدروس والطلاب بسهولة",
      href: "/auth/register/teacher",
      icon: <User className="w-10 h-10 text-orange-500" />,
    },
    {
      title: "تسجيل الطالب",
      description: "ابدأ رحلتك التعليمية وتابع دروسك وتقدمك",
      href: "/auth/register/student",
      icon: <GraduationCap className="w-10 h-10 text-orange-500" />,
    },
    {
      title: "تسجيل ولي الأمر",
      description: "تابع أداء طفلك وتقدمه الأكاديمي بسهولة",
      href: "/auth/register/parent",
      icon: <Users className="w-10 h-10 text-orange-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7f2] via-[#fff] to-[#ffe2c8] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Side - Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 border border-white/40"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              اختر نوع التسجيل
            </h1>
            <p className="text-gray-600 text-lg">
              قم باختيار نوع الحساب الذي ترغب في إنشائه
            </p>
          </div>

          <div className="grid gap-6">
            {registrationTypes.map((type, i) => (
              <motion.div
                key={type.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Link href={type.href}>
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px rgba(255,117,31,0.15)",
                    }}
                    className="flex items-center gap-5 bg-white rounded-2xl border border-gray-200 hover:border-orange-400 transition-all p-6 cursor-pointer group"
                  >
                    <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-all">
                      {type.icon}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-gray-500 mt-1 text-sm">{type.description}</p>
                    </div>

                    <motion.div
                      className="text-orange-400 text-lg font-bold"
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/auth/login"
                className="text-orange-500 hover:underline font-semibold"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Animation / Illustration */}
        <div className="order-1 lg:order-2">
          <AnimatedSide />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
