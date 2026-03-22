"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Users, Star, Clock } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-white rounded-2xl p-6 md:p-12 shadow-md">
      <div className="container mx-auto px-6 space-y-10">

        {/* Header — نفس نمط FeaturesSection و PricingSection */}
        <div className="text-center space-y-4">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
            من نحن
          </span>
          <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
            منصّة تجمع{" "}
            <span className="text-orange-500">المعلم</span>
            {" "}و
            <span className="text-orange-500">الطالب</span>
            {" "}و
            <span className="text-orange-500">ولي الأمر</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            ميعادك تساعدك على تنظيم الحصص، الحجوزات، الحضور، والدرجات في مكان واحد.
            صُممت لتسهيل التواصل بين جميع الأطراف وتحسين تجربة التعلم والمتابعة.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              bg: "bg-orange-50/60",
              title: "تجربة تعلم متكاملة",
              desc: "المعلم يضيف الحصص والامتحانات، والطالب يحجز ويتابع تقدّمه، وولي الأمر يراقب كل شيء بسهولة ووضوح.",
            },
            {
              icon: Users,
              bg: "bg-white",
              title: "أدوار وصلاحيات واضحة",
              desc: "نظام أدوار لخمس مستخدمين: مدير، معلم، طالب، ولي أمر، ومساعد، مع لوحات تحكم مخصصة لكل دور.",
            },
            {
              icon: Clock,
              bg: "bg-white",
              title: "تنظيم الوقت والحجوزات",
              desc: "جدول حصص، حجوزات، حضور، وباقات اشتراك للمعلمين مع إدارة كاملة من قِبَل الإدارة.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border border-gray-100 ${card.bg} p-6 flex flex-col gap-3 shadow-xl transition-all hover:shadow-2xl`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
                <card.icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision + CTA */}
        <div className="grid gap-6 md:grid-cols-2 items-center">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 text-right"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              رؤيتنا في <span className="text-orange-500">ميعادك</span>
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              نسعى لتقديم منصة تعليمية مرنة تساعد المعلم على التركيز في الشرح بدلاً من
              الانشغال بالإدارة، وتُمكّن الطالب وولي الأمر من رؤية تقدم المستوى
              الدراسي بشكل لحظي.
            </p>
            <div className="flex items-center justify-end gap-3 text-sm text-gray-700">
              <span>نظام تقييم للمعلمين يساعد على تحسين جودة التعليم.</span>
              <Star className="text-yellow-400 shrink-0" size={18} />
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-6 flex flex-col gap-4 text-right"
          >
            <h3 className="font-semibold text-gray-900">جاهز للبدء؟</h3>
            <p className="text-gray-600 text-sm">
              يمكنك إنشاء حساب جديد كمعلم أو طالب أو ولي أمر، أو تسجيل الدخول إذا
              كان لديك حساب مسبقًا.
            </p>
            <div className="flex flex-wrap gap-3 justify-end">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 rounded-full border border-orange-400 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
              >
                إنشاء حساب
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}