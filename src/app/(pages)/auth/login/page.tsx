"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSide } from "@/components/shared";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            alert("خطأ في البريد أو كلمة المرور");
        } else {
            // Redirect to home page after successful login
            router.push("/");
        }
    };

    return (
        <main className="container min-h-screen grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="order-2 flex flex-col justify-center items-center md:items-end px-6 md:px-16 py-10 space-y-8 text-center md:text-right">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
                        تسجيل الدخول إلى <span className="text-orange-500">ميعادك</span>
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg">
                        مرحبًا بعودتك! من فضلك قم بإدخال بياناتك للمتابعة
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-right focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    <Button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
                    >
                        تسجيل الدخول
                    </Button>
                </form>
            </div>

            <div className="order-1 flex justify-center md:justify-start">
                <AnimatedSide />
            </div>
        </main>
    );
};

export default LoginPage;
