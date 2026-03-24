"use client";

import { useState, useEffect } from "react";
import {
  Users, GraduationCap, BookOpen, UserCheck,
  TrendingUp, TrendingDown, ArrowLeft,
  CalendarDays, Clock, Bell, Activity,
  Package, LayoutList, ChevronLeft,
  CircleDot,
} from "lucide-react";


const STATS = [
  {
    key: "teachers",
    label: "المعلمون",
    value: 48,
    change: +6,
    icon: BookOpen,
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
    border: "border-amber-100",
    trend: "up",
  },
  {
    key: "students",
    label: "الطلاب",
    value: 1240,
    change: +83,
    icon: GraduationCap,
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    border: "border-orange-100",
    trend: "up",
  },
  {
    key: "parents",
    label: "أولياء الأمور",
    value: 890,
    change: +41,
    icon: Users,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-100",
    trend: "up",
  },
  {
    key: "assistants",
    label: "المساعدون",
    value: 22,
    change: -2,
    icon: UserCheck,
    bg: "bg-stone-50",
    iconColor: "text-stone-500",
    border: "border-stone-100",
    trend: "down",
  },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "student",   name: "أحمد محمود علي",      action: "تم تسجيله كطالب جديد",        time: "منذ 5 دقائق",   dot: "bg-amber-400" },
  { id: 2, type: "teacher",   name: "أ. سارة إبراهيم",     action: "أضافت مادة الرياضيات",         time: "منذ 18 دقيقة",  dot: "bg-orange-400" },
  { id: 3, type: "parent",    name: "محمد عبد الرحمن",      action: "طلب مراجعة الاشتراك",          time: "منذ 45 دقيقة",  dot: "bg-amber-300" },
  { id: 4, type: "student",   name: "نور خالد حسن",         action: "تم تحديث مستواها الدراسي",     time: "منذ ساعة",      dot: "bg-amber-400" },
  { id: 5, type: "assistant", name: "عمر طارق سعيد",        action: "انضم كمساعد للأستاذة سارة",    time: "منذ ساعتين",    dot: "bg-stone-400" },
];

const QUICK_LINKS = [
  { label: "إدارة المستخدمين",   icon: Users,        href: "/admin/users",    color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100"  },
  { label: "الباقات",             icon: Package,      href: "/admin/packages", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  { label: "المستويات",           icon: LayoutList,   href: "/admin/levels",   color: "text-amber-700",  bg: "bg-amber-100", border: "border-amber-200"  },
  { label: "المواد الدراسية",     icon: BookOpen,     href: "/admin/subjects", color: "text-stone-600",  bg: "bg-stone-50",  border: "border-stone-100"  },
];

// ─── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString("ar-EG")}</>;
}

// ─── Greeting based on time ───────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "مساء الخير";
  return "مساء النور";
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-EG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div
      className="min-h-screen bg-slate-50 p-6 space-y-6"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* ── Welcome Banner ──────────────────────────────────────────────────── */}
      <div
        className="fade-up relative overflow-hidden rounded-2xl bg-gradient-to-l from-amber-500 to-amber-400 p-6 text-white"
        style={{
          boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
          animationDelay: "0ms",
        }}
      >
        {/* decorative circles */}
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 left-16 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-4 left-32 w-14 h-14 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-amber-100 text-xs font-medium mb-1 flex items-center gap-1.5">
              <Clock size={12} /> {dateStr}
            </p>
            <h1 className="text-2xl font-black mb-1">
              {getGreeting()}، دفعه 💂‍♂️ 👋
            </h1>
            <p className="text-amber-100 text-sm">
              لديك <span className="text-white font-bold">3 إشعارات</span> جديدة تنتظرك اليوم
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30
                             rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border border-white/20">
            <Bell size={14} />
            عرض الإشعارات
          </button>
        </div>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const { icon: Icon } = stat;
          return (
            <div
              key={stat.key}
              className={`fade-up bg-white rounded-2xl p-5 border ${stat.border} transition-all
                          hover:-translate-y-0.5 hover:shadow-md`}
              style={{
                animationDelay: `${80 + i * 60}ms`,
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon size={18} className={stat.iconColor} strokeWidth={1.8} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold
                                  ${stat.trend === "up" ? "text-emerald-500" : "text-red-400"}`}>
                  {stat.trend === "up"
                    ? <TrendingUp size={12} />
                    : <TrendingDown size={12} />}
                  {Math.abs(stat.change)}
                </span>
              </div>
              <p className="text-2xl font-black text-slate-800 mb-0.5">
                <Counter target={stat.value} />
              </p>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row: Activity + Quick Links ──────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent Activity — spans 2 cols */}
        <div
          className="fade-up lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ animationDelay: "320ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">آخر النشاطات</h2>
            </div>
            <button className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700
                               font-semibold transition-colors">
              عرض الكل <ChevronLeft size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={item.id}
                className="fade-up flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
                style={{ animationDelay: `${380 + i * 50}ms` }}
              >
                {/* Avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200
                                flex items-center justify-center flex-shrink-0 text-amber-700 font-bold text-xs">
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 truncate">{item.action}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <CircleDot size={8} className={item.dot.replace("bg-", "text-")} />
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div
          className="fade-up bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ animationDelay: "360ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <ArrowLeft size={15} className="text-amber-500" />
            <h2 className="font-bold text-slate-700 text-sm">روابط سريعة</h2>
          </div>

          <div className="p-3 space-y-2">
            {QUICK_LINKS.map((link, i) => {
              const { icon: Icon } = link;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`fade-up flex items-center gap-3 px-4 py-3 rounded-xl border
                              ${link.bg} ${link.border} hover:shadow-sm transition-all
                              hover:-translate-y-0.5 group`}
                  style={{ animationDelay: `${420 + i * 50}ms` }}
                >
                  <Icon size={16} className={link.color} strokeWidth={1.8} />
                  <span className={`text-sm font-semibold ${link.color}`}>{link.label}</span>
                  <ChevronLeft size={14} className={`mr-auto opacity-0 group-hover:opacity-100
                                                     transition-opacity ${link.color}`} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Mini calendar note + system status ───────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Today's summary */}
        <div
          className="fade-up bg-white rounded-2xl border border-slate-100 p-5"
          style={{ animationDelay: "560ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={15} className="text-amber-500" />
            <h2 className="font-bold text-slate-700 text-sm">ملخص اليوم</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "طلاب جدد",    value: "14", color: "text-amber-600",  bg: "bg-amber-50"  },
              { label: "جلسات اليوم", value: "31", color: "text-orange-600", bg: "bg-orange-50" },
              { label: "طلبات معلقة", value: "5",  color: "text-red-500",    bg: "bg-red-50"    },
            ].map(item => (
              <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div
          className="fade-up bg-white rounded-2xl border border-slate-100 p-5"
          style={{ animationDelay: "600ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={15} className="text-amber-500" />
            <h2 className="font-bold text-slate-700 text-sm">حالة النظام</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "الخادم الرئيسي",  status: "يعمل بشكل طبيعي",  dot: "bg-emerald-400" },
              { label: "قاعدة البيانات",  status: "يعمل بشكل طبيعي",  dot: "bg-emerald-400" },
              { label: "خدمة الإشعارات", status: "تأخر بسيط",         dot: "bg-amber-400"   },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${item.dot} animate-pulse`} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}