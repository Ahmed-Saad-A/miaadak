"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedSide } from "@/components/shared";
import { Mail, ArrowLeft, Clock, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import mainLogo from '@/assets/mainLogo.png';
import { servicesApi } from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";

const ConfirmEmailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [timeLeft, setTimeLeft] = useState(120);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsResendEnabled(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResendCode = async () => {
        if (!email || isResending) return;

        setIsResending(true);
        toast.loading("جارٍ إعادة إرسال رمز التحقق...", { id: "resend-code" });

        try {
            const response = await servicesApi.resendConfirmationEmail(email);

            if (response.isSucceeded) {
                toast.success("تم إعادة إرسال رمز التحقق بنجاح", { id: "resend-code" });
                setTimeLeft(120);
                setIsResendEnabled(false);
            } else {
                toast.error(response.message || "فشل في إعادة إرسال رمز التحقق", { id: "resend-code" });
            }
        } catch (error) {
            console.error("Error resending confirmation email:", error);
            toast.error("حدث خطأ في إعادة إرسال رمز التحقق", { id: "resend-code" });
        } finally {
            setIsResending(false);
        }
    };

    const handleEmailClick = () => {
        window.open(`mailto:${email}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Left side - Confirmation Form */}
                    <div className="order-2 lg:order-1 lg:col-span-2">
                        <div className="w-full max-w-md mx-auto">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                {/* Back Button */}
                                <motion.button
                                    onClick={() => router.push("/auth/register")}
                                    className="flex items-center text-gray-600 hover:text-[#ff751f] transition-colors mb-6"
                                    whileHover={{ x: -5 }}
                                >
                                    <ArrowLeft className="w-4 h-4 ml-2" />
                                    العودة للتسجيل
                                </motion.button>

                                {/* Main Content */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="w-20 h-20 bg-[#d6d6d6] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Image
                                            src={mainLogo}
                                            alt="ميعادك Logo"
                                            width={150}
                                            height={150}
                                            className="object-contain"
                                        />
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl font-bold text-gray-900 mb-3"
                                    >
                                        تحقق من بريدك الإلكتروني
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-gray-600 mb-6"
                                    >
                                        تم إرسال رابط التحقق إلى بريدك الإلكتروني
                                    </motion.p>
                                </div>

                                {/* Email Display */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-gray-50 rounded-xl p-4 mb-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Mail className="w-5 h-5 text-gray-400 ml-2" />
                                            <span className="text-sm text-gray-600">البريد الإلكتروني:</span>
                                        </div>
                                        <button
                                            onClick={handleEmailClick}
                                            className="text-[#ff751f] hover:text-[#da9752] font-medium text-sm transition-colors"
                                        >
                                            {email}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Instructions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
                                >
                                    <div className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-blue-500 ml-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium mb-1">خطوات التحقق:</p>
                                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                                <li>افتح بريدك الإلكتروني</li>
                                                <li>ابحث عن رسالة من ميعادك</li>
                                                <li>اضغط على رابط التحقق</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Countdown Timer */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-center mb-6"
                                >
                                    <div className="flex items-center justify-center mb-3">
                                        <Clock className="w-5 h-5 text-gray-400 ml-2" />
                                        <span className="text-sm text-gray-600">يمكنك إعادة الإرسال خلال:</span>
                                    </div>

                                    <motion.div
                                        key={timeLeft}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        className="text-2xl font-bold text-[#ff751f] mb-2"
                                    >
                                        {formatTime(timeLeft)}
                                    </motion.div>

                                    {!isResendEnabled && (
                                        <p className="text-xs text-gray-500">
                                            انتظر حتى انتهاء العد التنازلي لإعادة الإرسال
                                        </p>
                                    )}
                                </motion.div>

                                {/* Resend Button */}
                                <motion.button
                                    onClick={handleResendCode}
                                    disabled={!isResendEnabled || isResending}
                                    className={`
                    w-full px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center
                    ${isResendEnabled && !isResending
                                            ? 'bg-[#ff751f] text-white hover:bg-[#da9752]'
                                            : 'bg-[#d6d6d6] text-gray-500 cursor-not-allowed'
                                        }
                  `}
                                    whileHover={isResendEnabled && !isResending ? { scale: 1.02 } : {}}
                                    whileTap={isResendEnabled && !isResending ? { scale: 0.98 } : {}}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    {isResending ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin ml-2" />
                                            جارٍ الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-5 w-5 ml-2" />
                                            أعد إرسال رابط التحقق
                                        </>
                                    )}
                                </motion.button>

                                {/* Additional Help */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-6 text-center"
                                >
                                    <p className="text-sm text-gray-500 mb-2">
                                        لم تستلم الرسالة؟
                                    </p>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <p>• تحقق من مجلد الرسائل المهملة</p>
                                        <p>• تأكد من صحة عنوان البريد الإلكتروني</p>
                                        <p>• قد تستغرق الرسالة بضع دقائق للوصول</p>
                                    </div>
                                </motion.div>

                                {/* Login Link */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    className="mt-6 text-center"
                                >
                                    <p className="text-sm text-gray-600">
                                        لديك حساب بالفعل؟{" "}
                                        <Link
                                            href="/auth/login"
                                            className="text-[#ff751f] hover:underline font-semibold"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right side - Animated Side */}
                    <div className="order-1 lg:order-2 lg:col-span-1">
                        <AnimatedSide />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmailPage;