"use client";
import React, { useState } from "react";
import AnimatedSide from "@/components/shared/AnimatedSide";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="container min-h-screen grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Right side (Form) */}
            <div className="order-2 flex flex-col justify-center items-center md:items-end px-6 md:px-16 py-10 space-y-8 text-center md:text-right">
                {/* العنوان */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
                        تسجيل الدخول إلى <span className="text-orange-500">ميعادك</span>
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg">
                        مرحبًا بعودتك! من فضلك قم بإدخال بياناتك للمتابعة
                    </p>
                </div>

                {/* الفورم */}
                <form className="w-full max-w-sm space-y-5">
                    {/* الإيميل */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-right focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="كلمة المرور"
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-right focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-3 text-gray-500 hover:text-orange-500 transition"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="text-right">
                        <Link
                            href="/auth/forgot-password"
                            className="text-orange-500 hover:underline text-sm font-medium"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    </div>

                    <Button className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition">
                        تسجيل الدخول
                    </Button>
                </form>

                <p className="text-gray-700 text-sm">
                    لا يوجد لديك حساب؟{" "}
                    <Link
                        href="/auth/register"
                        className="text-orange-500 hover:underline font-medium"
                    >
                        أنشئ حسابًا
                    </Link>
                </p>
            </div>

            {/* Left side (Animation) */}
            <div className="order-1 flex justify-center md:justify-start">
                <AnimatedSide />
            </div>
        </main>
    );
};

export default LoginPage;
