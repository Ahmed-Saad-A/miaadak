"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSide from "@/components/shared/AnimatedSide";
import logo from "@/assets/Logo.png";
import { Button } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#F3F5F7] w-full flex items-center justify-center">
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

      <main className="relative w-full max-w-6xl mt-16 sm:mt-0 lg:mt-0 md:mt-0 mx-auto grid grid-cols-1 md:grid-cols-2 md:items-center px-6 py-12 md:py-0 md:direction-ltr">

        {/* Right Section (Animated Image) */}
        <div className="flex justify-center md:justify-end items-center w-full h-auto md:h-full order-1 md:order-none">
          <AnimatedSide />
        </div>

        {/* Left Section (Content) */}
        <div className="flex flex-col justify-center items-center md:items-start text-center order-2 md:text-right w-full h-auto md:h-[100vh]">
          <Image
            src={logo}
            alt="logo"
            className="w-48 sm:w-60 md:w-full object-contain drop-shadow-lg z-10 mb-6 md:mb-0"
          />

          <div className="w-full text-center md:text-right z-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-4">
              أهلاً بك في <span className="text-orange-500">ميعادك</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              احجز دروسك بسهولة مع أفضل المعلمين في كل المراحل الدراسية
            </p>

            {/* buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
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
