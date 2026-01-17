"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Users, Star, Clock } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-10 rounded-2xl shadow-xl">
      <div className="w-full mx-auto backdrop-blur-xl p-10  space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-sm font-semibold text-orange-500 tracking-wide">
            عن منصة ميعادك
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            منصّة تعليمية تجمع بين <span className="text-orange-500">المعلم</span> و
            <span className="text-orange-500">الطالب</span> و
            <span className="text-orange-500">ولي الأمر</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            ميعادك تساعدك على تنظيم الحصص، الحجوزات، الحضور، والدرجات في مكان واحد.
            صُممت لتسهيل التواصل بين جميع الأطراف وتحسين تجربة التعلم والمتابعة.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-gray-100 bg-orange-50/60 p-6 flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-bold text-gray-900">تجربة تعلم متكاملة</h3>
            <p className="text-gray-600 text-sm">
              المعلم يضيف الحصص والامتحانات، والطالب يحجز ويتابع تقدّمه، وولي الأمر
              يراقب كل شيء بسهولة ووضوح.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-gray-900">أدوار وصلاحيات واضحة</h3>
            <p className="text-gray-600 text-sm">
              نظام أدوار لخمس مستخدمين: مدير، معلم، طالب، ولي أمر، ومساعد، مع صفحات
              ولوحات تحكم مخصصة لكل دور.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-gray-900">تنظيم الوقت والحجوزات</h3>
            <p className="text-gray-600 text-sm">
              جدول حصص، حجوزات، حضور، وباقات اشتراك للمعلمين مع إدارة كاملة من
              قِبَل الإدارة.
            </p>
          </motion.div>
        </div>

        {/* Rating / Vision */}
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              رؤيتنا في <span className="text-orange-500">ميعادك</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              نسعى لتقديم منصة تعليمية مرنة تساعد المعلم على التركيز في الشرح بدلاً من
              الانشغال بالإدارة، وتُمكّن الطالب وولي الأمر من رؤية تقدم المستوى
              الدراسي بشكل لحظي من خلال الحضور، الدرجات، والتقييمات.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Star className="text-yellow-400" size={18} />
              <span>نظام تقييم للمعلمين يساعد على تحسين جودة العملية التعليمية.</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-6 flex flex-col gap-4"
          >
            <h3 className="font-semibold text-gray-900">جاهز للبدء؟</h3>
            <p className="text-gray-600 text-sm">
              يمكنك إنشاء حساب جديد كمعلم أو طالب أو ولي أمر، أو تسجيل الدخول إذا كان
              لديك حساب مسبقًا.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
              >
                إنشاء حساب
              </Link>
              <Link
                href="/auth/login"
                className="px-5 py-2.5 rounded-full border border-orange-400 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition"
              >
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

