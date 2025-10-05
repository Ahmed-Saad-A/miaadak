"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSide from "@/components/shared/AnimatedSide";
import logo from "../assets/Logo.png";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#F3F5F7] min-h-screen w-full flex flex-col items-center justify-center">
      <motion.div
                className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full"
                animate={{ y: [0, 30, 0] }}
                transition={{ repeat: Infinity, duration: 6 }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100 rounded-full"
                animate={{ x: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 8 }}
            />
      <main className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 py-12 items-center">
        {/* Left - Logo + نص */}
        <div className="relative flex flex-col items-center md:items-start text-center md:text-right gap-6">
          <Image
            src={logo}
            alt="logo"
            className="w-full h-fit object-contain drop-shadow-lg"
          />

          <div className="absolute -bottom-7 flex flex-col items-center md:items-start text-center md:text-right gap-4 mt-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900">
              أهلاً بك في <span className="text-orange-500">ميعادك</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-md">
              احجز دروسك بسهولة مع أفضل المعلمين في كل المراحل الدراسية
            </p>

            <div className="flex gap-4 mt-4 justify-center w-full">
              <button className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg shadow hover:bg-orange-100 transition font-semibold">
                تسجيل دخول
              </button>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition font-semibold">
                إنشاء حساب
              </button>
            </div>
          </div>
        </div>

        {/* Right - Student Section */}
        <AnimatedSide />
      </main>
    </div>
  );
}
