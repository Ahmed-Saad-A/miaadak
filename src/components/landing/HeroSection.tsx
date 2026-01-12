"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Soft background accents */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl" />
            <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="container relative mx-auto grid min-h-[90vh] grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
                {/* TEXT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-right"
                >
                    <span className="mb-4 inline-block rounded-full bg-orange-50 px-4 py-1 text-sm font-medium text-orange-600">
                        المنصة التعليمية الأولى في المنطقة
                    </span>

                    <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                        تعليم{" "}
                        <span className="bg-gradient-to-l from-orange-500 to-amber-400 bg-clip-text text-transparent">
                            ذكي
                        </span>
                        <br />
                        نتائج حقيقية
                        <br />
                        في وقت أقل
                    </h1>

                    <p className="mt-6 max-w-xl text-lg text-gray-600">
                        منصة متكاملة تجمع المعلمين والطلاب وأولياء الأمور.
                        احجز حصصك، تابع تقدمك، وحقق أهدافك التعليمية بسهولة.
                    </p>

                    {/* CTA */}
                    <div className="mt-8 flex flex-wrap justify-end gap-4">
                        <Button
                            size="lg"
                            className="gap-2 bg-gradient-to-l from-orange-500 to-amber-400 px-8 text-base shadow-md hover:opacity-90"
                        >
                            ابدأ الآن مجانًا
                            <ArrowLeft size={18} />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="gap-2 border-orange-300 px-8 text-base text-orange-600 hover:bg-orange-50"
                        >
                            شاهد العرض التوضيحي
                            <PlayCircle size={18} />
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-10 flex flex-wrap justify-end gap-10">
                        <Stat number="5000+" label="طالب مسجل" />
                        <Stat number="200+" label="معلم معتمد" />
                        <Stat number="98%" label="رضا العملاء" />
                    </div>
                </motion.div>

                {/* MOCKUP */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative"
                >
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                        {/* Fake header */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-400" />
                                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                <span className="h-3 w-3 rounded-full bg-green-400" />
                            </div>
                            <span className="text-sm text-gray-400">Dashboard</span>
                        </div>

                        {/* Cards */}
                        <div className="grid gap-4">
                            <div className="rounded-xl bg-orange-50 p-4">
                                <p className="text-sm text-gray-500">الحصة القادمة</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    الجبر – الصف الثالث
                                </p>
                                <p className="text-sm text-orange-600">اليوم 4:00 م</p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">تقدم الطالب</p>
                                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                    <div className="h-2 w-[85%] rounded-full bg-gradient-to-l from-orange-500 to-amber-400" />
                                </div>
                                <p className="mt-1 text-sm text-gray-600">85%</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -bottom-6 -left-6 rounded-xl bg-white px-4 py-3 shadow-lg"
                    >
                        <p className="text-sm font-medium">⭐ 4.9 تقييم المعلمين</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function Stat({ number, label }: { number: string; label: string }) {
    return (
        <div className="text-right">
            <p className="text-3xl font-bold text-orange-600">{number}</p>
            <p className="text-sm text-gray-600">{label}</p>
        </div>
    );
}
