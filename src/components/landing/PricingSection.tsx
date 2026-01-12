"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "الأساسية",
        price: "99",
        desc: "مثالية للطلاب الجدد",
        features: [
            "10 حصص شهريًا",
            "حتى 15 طالب لكل حصة",
            "مدرس واحد",
            "دعم فني أساسي",
            "إحصائيات أساسية",
        ],
    },
    {
        name: "المتقدمة",
        price: "199",
        badge: "الأكثر شيوعًا",
        desc: "الأفضل للمعلمين",
        features: [
            "30 حصة شهريًا",
            "حتى 30 طالب لكل حصة",
            "3 مساعدين",
            "دعم فني متقدم",
            "إحصائيات متقدمة",
            "ربط حصص مخصص",
        ],
        highlight: true,
    },
    {
        name: "المؤسسات",
        price: "399",
        desc: "للمراكز والمؤسسات",
        features: [
            "حصص غير محدودة",
            "طلاب غير محدودين",
            "مساعدين غير محدودين",
            "دعم 24/7",
            "تقارير شاملة",
            "واجهة مخصصة",
        ],
    },
];

export default function PricingSection() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
                        الباقات
                    </span>
                    <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
                        اختر الباقة{" "}
                        <span className="text-orange-500">المناسبة لك</span>
                    </h2>
                    <p className="mt-4 text-gray-600">
                        باقات مرنة تناسب جميع الاحتياجات مع تجربة مجانية
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative rounded-3xl border p-8 text-right ${plan.highlight
                                    ? "scale-105 border-orange-400 shadow-xl"
                                    : "hover:shadow-lg"
                                }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 right-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                                    {plan.badge}
                                </span>
                            )}

                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="mt-2 text-sm text-gray-600">{plan.desc}</p>

                            <div className="my-6">
                                <span className="text-4xl font-extrabold text-orange-500">
                                    {plan.price}
                                </span>
                                <span className="text-gray-600"> ج.م / شهريًا</span>
                            </div>

                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center justify-end gap-2">
                                        <span className="text-sm text-gray-600">{feature}</span>
                                        <Check className="h-4 w-4 text-orange-500" />
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`mt-8 w-full ${plan.highlight
                                        ? "bg-gradient-to-l from-orange-500 to-amber-400 text-white"
                                        : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                    }`}
                            >
                                ابدأ الآن
                            </Button>

                            <p className="mt-3 text-center text-xs text-gray-500">
                                بدون بطاقة • إلغاء في أي وقت
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
