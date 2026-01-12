"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Video,
    Calendar,
    GraduationCap,
    Bell,
    CreditCard,
    Star,
    Users,
} from "lucide-react";

const features = [
    {
        icon: BarChart3,
        title: "تتبع الأداء",
        desc: "تابع تقدمك ودرجاتك وحضورك في مكان واحد",
    },
    {
        icon: Video,
        title: "تعلم أونلاين وحضوري",
        desc: "اختر طريقة التعلم المناسبة لك بسهولة",
    },
    {
        icon: Calendar,
        title: "جدولة مرنة",
        desc: "احجز الحصص في الوقت الذي يناسبك",
    },
    {
        icon: GraduationCap,
        title: "معلمون متميزون",
        desc: "نخبة من أفضل المعلمين في جميع المواد",
    },
    {
        icon: Bell,
        title: "إشعارات فورية",
        desc: "تنبيهات للحصص القادمة والنتائج",
    },
    {
        icon: CreditCard,
        title: "اشتراكات مرنة",
        desc: "باقات متنوعة تناسب جميع الاحتياجات",
    },
    {
        icon: Star,
        title: "نظام تقييم شفاف",
        desc: "قيّم المعلمين وساعد الآخرين في الاختيار",
    },
    {
        icon: Users,
        title: "متابعة أولياء الأمور",
        desc: "متابعة مستمرة لأداء الأبناء",
    },
];

export default function FeaturesSection() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
                        المميزات
                    </span>
                    <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
                        كل ما تحتاجه في{" "}
                        <span className="text-orange-500">مكان واحد</span>
                    </h2>
                    <p className="mt-4 text-gray-600">
                        منصة متكاملة توفر جميع أدوات التعلم والتعليم بفعالية
                    </p>
                </div>

                {/* Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="rounded-2xl border bg-white p-6 text-right transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <feature.icon size={24} />
                            </div>

                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
