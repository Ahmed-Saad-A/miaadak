"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSide from "@/components/shared/AnimatedSide";
import logo from "@/assets/logo.png";
import { Button } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden sm:min-h-screen h-screen bg-[#F3F5F7] w-full flex items-center justify-center">
      {/* الدوائر المتحركة */}
      <motion.div
        className="absolute z-1 top-24 left-16 w-32 h-32 bg-orange-100 rounded-full"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute z-1 bottom-24 right-20 w-40 h-40 bg-blue-100 rounded-full"
        animate={{ x: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <main className="relative w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-6 py-12 md:py-0">
        {/* Right Section */}
        <div className="flex justify-center md:justify-star">
          <AnimatedSide />
        </div>

        {/* Left Section */}
        <div className="flex flex-col mt-24 justify-start items-center md:items-start text-center md:text-right w-full min-h-[30vh] md:h-[100vh] md:mt-0">
          {/* اللوجو */}
          <Image
            src={logo}
            alt="logo"
            className="sm:w-full md:w-full object-contain drop-shadow-lg z-10"
          />

          {/* النصوص - فوق اللوجو مباشرة */}
          <div className="w-full text-center mt-16 md:top-[70%] md:right-0 md:translate-y-[-50%] z-20">
            <h1 className="w-full text-center md:text-center text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-3 sm:mb-16">
              أهلاً بك في <span className="text-orange-500">ميعادك</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 md:mx-0 leading-relaxed">
              احجز دروسك بسهولة مع أفضل المعلمين في كل المراحل الدراسية
            </p>

            {/* الأزرار */}
            <div className="w-full flex flex-wrap justify-center md:justify-center gap-4 pt-6">
              <Button className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition font-semibold">
                <Link href="/auth/register" replace>إنشاء حساب</Link>
              </Button>
              <Button className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg shadow hover:bg-orange-100 transition font-semibold">
                <Link href="/auth/login" replace>تسجيل الدخول</Link>
              </Button>
            </div>
          </div>
        </div>


      </main>

    </div>

  );
}
