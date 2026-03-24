"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherApi } from "@/services/teacherApi";
import { Package } from "@/interfaces";


const packageNameMap: Record<number, string> = {
    1: "الأساسية",
    2: "المتقدمة",
    3: "المؤسسات",
};

export default function PricingSection() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        teacherApi
            .getAllPackages()
            .then((res) => setPackages(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-24 text-center text-gray-500">
                جاري تحميل الباقات...
            </section>
        );
    }

    return (
        <section className="bg-white rounded-2xl p-2 md:p-12 pb-12 shadow-md">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
                        الباقات
                    </span>
                    <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
                        اختر الباقة <span className="text-orange-500">المناسبة لك</span>
                    </h2>
                    <p className="mt-4 text-gray-600">
                        باقات مرنة تناسب جميع الاحتياجات
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {packages.map((pkg, i) => {
                        const isPopular = pkg.name === 2;

                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`
                  relative rounded-3xl bg-white p-8 text-right
                  shadow-xl transition-all
                  hover:-translate-y-2 hover:shadow-2xl
                  ${isPopular ? "scale-105" : ""}
                `}
                            >
                                {isPopular && (
                                    <span className="absolute -top-3 right-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                                        الأكثر شيوعًا
                                    </span>
                                )}

                                <h3 className="text-xl font-bold text-gray-900">
                                    {packageNameMap[pkg.name]}
                                </h3>

                                <p className="mt-2 text-sm text-gray-600">
                                    {pkg.description}
                                </p>

                                <div className="my-6">
                                    <span className="text-4xl font-extrabold text-orange-500">
                                        {pkg.monthlyPrice}
                                    </span>
                                    <span className="text-gray-600"> ج.م / شهريًا</span>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center justify-end gap-2">
                                        <span className="text-sm text-gray-600">
                                            {pkg.maxSessionsPerMonth} حصة شهريًا
                                        </span>
                                        <Check className="h-4 w-4 text-orange-500" />
                                    </li>

                                    <li className="flex items-center justify-end gap-2">
                                        <span className="text-sm text-gray-600">
                                            حتى {pkg.maxStudentsPerSession} طالب لكل حصة
                                        </span>
                                        <Check className="h-4 w-4 text-orange-500" />
                                    </li>

                                    <li className="flex items-center justify-end gap-2">
                                        <span className="text-sm text-gray-600">
                                            {pkg.maxAssistantsPerTeacher} مساعدين
                                        </span>
                                        <Check className="h-4 w-4 text-orange-500" />
                                    </li>
                                </ul>

                                <Button className="mt-8 w-full bg-gradient-to-l from-orange-500 to-amber-400 text-white">
                                    اشترك الآن
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
