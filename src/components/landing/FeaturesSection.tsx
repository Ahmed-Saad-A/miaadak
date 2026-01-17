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
        <section className="bg-white rounded-2xl p-2 md:p-12 pb-12 shadow-md">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
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
                            className="
                group
                rounded-3xl
                bg-white
                p-8
                text-right
                shadow-xl
                transition-all
                hover:-translate-y-2
                hover:shadow-2xl
              "
                        >
                            {/* Icon */}
                            <div className="
                mb-5
                inline-flex
                h-14 w-14
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-600
                transition
                group-hover:scale-110
                group-hover:bg-orange-100
              ">
                                <feature.icon size={26} />
                            </div>

                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                {feature.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-gray-600">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
