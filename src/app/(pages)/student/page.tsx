"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, CalendarDays, Clock,
  CheckCircle2, ChevronLeft, Star,
  PlayCircle, Award, Flame, Target,
  Bell, Zap,
  BarChart3,
} from "lucide-react";


const STUDENT = {
  name: "أحمد محمود",
  level: "الصف الثالث الإعدادي",
  avatar: "أ",
  streak: 7,
  points: 1240,
};

const STATS = [
  { label: "الجلسات المكتملة", value: 24,  icon: CheckCircle2, color: "text-amber-500",  bg: "bg-amber-50",  border: "border-amber-100" },
  { label: "المواد المسجّلة",   value: 6,   icon: BookOpen,     color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { label: "ساعات الدراسة",    value: 48,  icon: Clock,        color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
  { label: "نقاط الإنجاز",     value: 1240, icon: Star,        color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100" },
];

const UPCOMING_SESSIONS = [
  { id: 1, subject: "الرياضيات",       teacher: "أ. سارة إبراهيم",   time: "اليوم — 04:00 م",   status: "soon",    color: "amber"  },
  { id: 2, subject: "اللغة العربية",   teacher: "أ. محمد رضا",        time: "غداً — 10:00 ص",    status: "upcoming", color: "orange" },
  { id: 3, subject: "العلوم",          teacher: "أ. نهى خالد",        time: "الإثنين — 02:00 م", status: "upcoming", color: "stone"  },
];

const SUBJECTS = [
  { name: "الرياضيات",      progress: 72, sessions: 8,  completed: 6,  icon: "📐" },
  { name: "اللغة العربية",  progress: 55, sessions: 6,  completed: 3,  icon: "📖" },
  { name: "العلوم",         progress: 88, sessions: 5,  completed: 5,  icon: "🔬" },
  { name: "اللغة الإنجليزية", progress: 40, sessions: 10, completed: 4, icon: "🌐" },
  { name: "التاريخ",        progress: 65, sessions: 4,  completed: 3,  icon: "🏛️" },
  { name: "الجغرافيا",      progress: 30, sessions: 4,  completed: 1,  icon: "🗺️" },
];

const RECENT = [
  { text: "أكملت جلسة الرياضيات",         time: "منذ يومين",  icon: CheckCircle2, color: "text-amber-500" },
  { text: "حصلت على 50 نقطة إضافية",      time: "منذ 3 أيام", icon: Star,         color: "text-yellow-500" },
  { text: "سجّلت في مادة الجغرافيا",      time: "منذ أسبوع",  icon: BookOpen,     color: "text-orange-500" },
  { text: "أكملت 5 جلسات متتالية",        time: "منذ أسبوع",  icon: Flame,        color: "text-red-400" },
];

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.ceil(target / 35);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setCount(target); clearInterval(t); }
      else setCount(v);
    }, 22);
    return () => clearInterval(t);
  }, [target]);
  return <>{count.toLocaleString("ar-EG")}</>;
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, color = "bg-amber-400" }: { value: number; color?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 300); }, [value]);
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Greeting ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "مساء الخير";
  return "مساء النور";
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const dateStr = new Date().toLocaleDateString("ar-EG", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div
      className="min-h-screen bg-slate-50 p-5 space-y-5"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu { animation: fadeUp .4s ease both; }
      `}</style>

      {/* ── Welcome Banner ───────────────────────────────────────────────────── */}
      <div
        className="fu relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
          boxShadow: "0 10px 40px rgba(245,158,11,0.35)",
          animationDelay: "0ms",
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-6 left-44 w-12 h-12 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          {/* Left: text */}
          <div className="flex-1 min-w-0">
            <p className="text-amber-100 text-xs mb-1 flex items-center gap-1.5">
              <CalendarDays size={11} /> {dateStr}
            </p>
            <h1 className="text-xl font-black text-white mb-1">
              {getGreeting()}، {STUDENT.name} 👋
            </h1>
            <p className="text-amber-100 text-xs leading-relaxed">
              {STUDENT.level} · لديك <span className="text-white font-bold">جلسة اليوم</span> الساعة 4 مساءً
            </p>

            {/* Streak */}
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm
                            border border-white/25 rounded-xl px-3 py-1.5">
              <Flame size={13} className="text-yellow-200" />
              <span className="text-white text-xs font-bold">{STUDENT.streak} أيام متتالية 🔥</span>
            </div>
          </div>

          {/* Right: avatar + points */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white/25 border-2 border-white/30
                            flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {STUDENT.avatar}
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg leading-none">
                {STUDENT.points.toLocaleString("ar-EG")}
              </p>
              <p className="text-amber-100 text-[10px]">نقطة</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => {
          const { icon: Icon } = s;
          return (
            <div
              key={s.label}
              className={`fu bg-white rounded-2xl p-4 border ${s.border}
                          hover:-translate-y-0.5 hover:shadow-md transition-all`}
              style={{ animationDelay: `${80 + i * 55}ms`, boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
            >
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon size={15} className={s.color} strokeWidth={1.8} />
              </div>
              <p className="text-xl font-black text-slate-800">
                <Counter target={s.value} />
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row ───────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Upcoming Sessions — 3 cols */}
        <div
          className="fu lg:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ animationDelay: "300ms", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle size={15} className="text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">الجلسات القادمة</h2>
            </div>
            <button className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold">
              الكل <ChevronLeft size={12} />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {UPCOMING_SESSIONS.map((session, i) => {
              const isSoon = session.status === "soon";
              return (
                <div
                  key={session.id}
                  className={`fu flex items-center gap-3 p-3.5 rounded-xl border transition-all
                              ${isSoon
                                ? "bg-amber-50 border-amber-200"
                                : "bg-slate-50/50 border-slate-100 hover:border-amber-200 hover:bg-amber-50/30"
                              }`}
                  style={{ animationDelay: `${360 + i * 60}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg
                                   ${isSoon ? "bg-amber-500 shadow-md shadow-amber-200" : "bg-white border border-slate-100"}`}>
                    {isSoon ? <PlayCircle size={18} className="text-white" /> : "📚"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isSoon ? "text-amber-700" : "text-slate-700"}`}>
                      {session.subject}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{session.teacher}</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg
                                      ${isSoon ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {session.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly goal + Quick actions — 2 cols */}
        <div className="lg:col-span-2 space-y-4">

          {/* Weekly Goal */}
          <div
            className="fu bg-white rounded-2xl border border-slate-100 p-5"
            style={{ animationDelay: "340ms", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target size={15} className="text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">هدف الأسبوع</h2>
            </div>

            <div className="text-center mb-4">
              {/* Circular-ish progress using a simple arc */}
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f59e0b" strokeWidth="7"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.68)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-800 leading-none">68%</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">17</span> من{" "}
                <span className="font-bold text-slate-700">25</span> جلسة
              </p>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-100">
              <Zap size={13} className="text-amber-500 flex-shrink-0" />
              <p className="text-[11px] text-amber-700 font-medium">
                تحتاج 8 جلسات لإتمام هدفك!
              </p>
            </div>
          </div>

          {/* Mini achievements */}
          <div
            className="fu bg-white rounded-2xl border border-slate-100 p-5"
            style={{ animationDelay: "380ms", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={15} className="text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">آخر الإنجازات</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["🔥 7 أيام", "⭐ 1000 نقطة", "📚 6 مواد", "✅ 24 جلسة"].map(badge => (
                <span key={badge}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg
                             bg-amber-50 text-amber-700 border border-amber-100">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Subjects Progress ─────────────────────────────────────────────────── */}
      <div
        className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ animationDelay: "440ms", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-amber-500" />
            <h2 className="font-bold text-slate-700 text-sm">تقدمي في المواد</h2>
          </div>
          <button className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold">
            عرض الكل <ChevronLeft size={12} />
          </button>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-50"
             style={{ direction: "ltr" }}>
          {SUBJECTS.map((sub, i) => {
            const barColor = sub.progress >= 70
              ? "bg-amber-400"
              : sub.progress >= 40
              ? "bg-orange-400"
              : "bg-slate-300";

            return (
              <div
                key={sub.name}
                className="fu p-4 hover:bg-slate-50/50 transition-colors"
                style={{ animationDelay: `${500 + i * 50}ms`, direction: "rtl" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sub.icon}</span>
                    <span className="text-sm font-bold text-slate-700">{sub.name}</span>
                  </div>
                  <span className={`text-xs font-black
                    ${sub.progress >= 70 ? "text-amber-500"
                      : sub.progress >= 40 ? "text-orange-500"
                      : "text-slate-400"}`}>
                    {sub.progress}%
                  </span>
                </div>
                <ProgressBar value={sub.progress} color={barColor} />
                <p className="text-[10px] text-slate-400 mt-1.5">
                  {sub.completed} من {sub.sessions} جلسات مكتملة
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity ───────────────────────────────────────────────────── */}
      <div
        className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ animationDelay: "580ms", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Bell size={15} className="text-amber-500" />
          <h2 className="font-bold text-slate-700 text-sm">آخر نشاطاتي</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {RECENT.map((item, i) => {
            const { icon: Icon } = item;
            return (
              <div
                key={i}
                className="fu flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors"
                style={{ animationDelay: `${620 + i * 45}ms` }}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100
                                flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className={item.color} />
                </div>
                <p className="text-xs text-slate-600 font-medium flex-1">{item.text}</p>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}