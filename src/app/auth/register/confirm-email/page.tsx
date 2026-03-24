"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, Clock, RefreshCw, CheckCircle, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import mainLogo from '@/assets/mainLogo.png';
import { servicesApi } from "@/services/authApi";
import toast from "react-hot-toast";
import Link from "next/link";

const ConfirmEmailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [timeLeft, setTimeLeft] = useState(() => {
        // جلب الوقت المتبقي من localStorage
        const saved = localStorage.getItem('resend_timer');
        if (saved) {
            const { timestamp, duration } = JSON.parse(saved);
            const elapsed = Math.floor((Date.now() - timestamp) / 1000);
            const remaining = duration - elapsed;
            return remaining > 0 ? remaining : 0;
        }
        return 120;
    });
    
    const [isResendEnabled, setIsResendEnabled] = useState(timeLeft === 0);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
                // حفظ الوقت في localStorage
                localStorage.setItem('resend_timer', JSON.stringify({
                    timestamp: Date.now(),
                    duration: timeLeft - 1
                }));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsResendEnabled(true);
            localStorage.removeItem('resend_timer');
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
                // حفظ الوقت الجديد
                localStorage.setItem('resend_timer', JSON.stringify({
                    timestamp: Date.now(),
                    duration: 120
                }));
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* خلفية متحركة */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#ff751f]/20 to-[#da9752]/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#da9752]/20 to-[#ff751f]/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="w-full max-w-2xl mx-auto relative z-10">
                    {/* نموذج التأكيد */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
                            {/* زر الرجوع */}
                            <motion.button
                                onClick={() => router.push("/auth/register")}
                                className="flex items-center text-gray-600 hover:text-[#ff751f] transition-colors mb-8 group"
                                whileHover={{ x: -5 }}
                            >
                                <ArrowLeft className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                                <span className="font-medium">العودة للتسجيل</span>
                            </motion.button>

                            {/* المحتوى الرئيسي */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ 
                                        delay: 0.2, 
                                        type: "spring", 
                                        stiffness: 200,
                                        damping: 15
                                    }}
                                    className="w-24 h-24 bg-gradient-to-br from-[#ff751f] to-[#da9752] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative"
                                >
                                    <Mail className="w-12 h-12 text-white" />
                                    <motion.div
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Sparkles className="w-3 h-3 text-white" />
                                    </motion.div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3"
                                >
                                    تحقق من بريدك الإلكتروني
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-600 text-lg"
                                >
                                    تم إرسال رابط التحقق إلى بريدك الإلكتروني
                                </motion.p>
                            </div>

                            {/* عرض البريد الإلكتروني */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 mb-6 border border-orange-100"
                            >
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center ml-3 shadow-sm">
                                            <Mail className="w-5 h-5 text-[#ff751f]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                                            <button
                                                onClick={handleEmailClick}
                                                className="text-[#ff751f] hover:text-[#da9752] font-semibold text-sm transition-colors hover:underline"
                                            >
                                                {email}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* التعليمات */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100"
                            >
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center ml-3 flex-shrink-0 shadow-sm">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-900 mb-3">خطوات التحقق:</p>
                                        <ul className="space-y-2">
                                            {[
                                                "افتح بريدك الإلكتروني",
                                                "ابحث عن رسالة من ميعادك",
                                                "اضغط على رابط التحقق"
                                            ].map((step, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.7 + index * 0.1 }}
                                                    className="flex items-center text-sm text-blue-800"
                                                >
                                                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center ml-2 text-xs font-bold text-blue-700">
                                                        {index + 1}
                                                    </div>
                                                    {step}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>

                            {/* مؤقت العد التنازلي */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-center mb-6"
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#ff751f] to-[#da9752] rounded-lg flex items-center justify-center ml-2">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">يمكنك إعادة الإرسال خلال:</span>
                                </div>

                                <motion.div
                                    key={timeLeft}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-block bg-gradient-to-r from-[#ff751f] to-[#da9752] text-white rounded-2xl px-8 py-4 mb-3 shadow-lg"
                                >
                                    <div className="text-4xl font-bold tracking-wider">
                                        {formatTime(timeLeft)}
                                    </div>
                                </motion.div>

                                {!isResendEnabled && (
                                    <p className="text-xs text-gray-500">
                                        انتظر حتى انتهاء العد التنازلي لإعادة الإرسال
                                    </p>
                                )}
                            </motion.div>

                            {/* زر إعادة الإرسال */}
                            <motion.button
                                onClick={handleResendCode}
                                disabled={!isResendEnabled || isResending}
                                className={`
                                    w-full px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg text-lg
                                    ${isResendEnabled && !isResending
                                        ? 'bg-gradient-to-r from-[#ff751f] to-[#da9752] text-white hover:shadow-2xl hover:scale-[1.02]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                                whileHover={isResendEnabled && !isResending ? { y: -2 } : {}}
                                whileTap={isResendEnabled && !isResending ? { scale: 0.98 } : {}}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
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

                            {/* مساعدة إضافية */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100"
                            >
                                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                                    لم تستلم الرسالة؟
                                </p>
                                <div className="space-y-2">
                                    {[
                                        "تحقق من مجلد الرسائل المهملة",
                                        "تأكد من صحة عنوان البريد الإلكتروني",
                                        "قد تستغرق الرسالة بضع دقائق للوصول"
                                    ].map((tip, index) => (
                                        <div key={index} className="flex items-start text-xs text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-[#ff751f] rounded-full mt-1.5 ml-2 flex-shrink-0" />
                                            {tip}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* رابط تسجيل الدخول */}
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
                                        className="text-[#ff751f] hover:text-[#da9752] font-bold hover:underline transition-colors"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
            </div>
        </div>
    );
};

export default ConfirmEmailPage;