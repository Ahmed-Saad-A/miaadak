"use client";
import React, { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSide } from "@/components/shared";
import toast from "react-hot-toast";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { Role } from "@/interfaces/roles";
import { roleRoutes } from "@/configuration/roles";
import { SessionUser } from "@/interfaces";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { setUser } = useUserStore();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        toast.loading("جارٍ تسجيل الدخول...", { id: "login" });

        try {
            const csrfResponse = await fetch("/api/auth/csrf");
            const { csrfToken } = await csrfResponse.json();

            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                csrfToken,
            });

            setIsLoading(false);
            toast.dismiss("login");

            if (!result) {
                toast.error("حدث خطأ أثناء الاتصال بالخادم.");
                return;
            }

            switch (result.error) {
                case "EmailNotConfirmed":
                    toast.error("لم يتم تأكيد البريد الإلكتروني.");
                    router.push(`/auth/register/confirm-email?email=${encodeURIComponent(email)}`);
                    return;
                case "InvalidCredentials":
                    toast.error("البريد أو كلمة المرور غير صحيحة.");
                    return;
                default:
                    if (result.error) {
                        toast.error(result.error);
                    } else if (result.ok) {
                        toast.success("تم تسجيل الدخول بنجاح 🎉");

                        const session = await getSession();
                        const user = session?.user as SessionUser;

                        setUser({
                            id: user?.id?.toString() || "",
                            name: user?.name || "",
                            role: (user?.role || "").toLowerCase() as Role,
                        });

                        const defaultRoute = roleRoutes[(user?.role || "").toLowerCase() as Role]?.[0]?.path;
                        router.push(defaultRoute);
                    } else {
                        toast.error("حدث خطأ أثناء تسجيل الدخول.");
                    }
            }
        } catch (err) {
            console.error("Login error:", err);
            setIsLoading(false);
            toast.dismiss("login");
            toast.error("حدث خطأ غير متوقع. حاول مرة أخرى.");
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
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-right focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-3 text-gray-500 hover:text-orange-500 transition"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="text-right mt-2 mb-3">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-blue-700 hover:text-orange-500 transition"
                        >
                            هل نسيت كلمة المرور؟
                        </Link>
                    </div>


                    <Button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                جاري تسجيل الدخول...
                            </>
                        ) : (
                            <>
                                <LogIn className="h-5 w-5 mr-2" />
                                تسجيل الدخول
                            </>
                        )}
                    </Button>

                    {/* 🔹 الروابط الجديدة */}
                    <div className="flex flex-col items-center space-y-2 mt-4">

                        <p className="text-sm text-gray-600">
                            ليس لديك حساب؟{" "}
                            <Link
                                href="/register"
                                className="text-orange-500 font-semibold hover:underline"
                            >
                                إنشاء حساب
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <div className="order-1 flex justify-center md:justify-start">
                <AnimatedSide />
            </div>
        </main>
    );
};

export default LoginPage;
