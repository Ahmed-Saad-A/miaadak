"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, Award, BookOpen,
  FlaskConical, Globe, Calculator, Minus,
  ChevronDown, ChevronUp, Target, BarChart3,
  Clock, GraduationCap, Star, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Exam {
  name:  string;
  score: number;
  total: number;
  date:  string;
  type:  "امتحان شامل" | "كويز" | "واجب";
}

interface Subject {
  id:      number;
  name:    string;
  teacher: string;
  icon:    React.ElementType;
  color:   string;
  exams:   Exam[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SUBJECTS: Subject[] = [
  {
    id: 1, name: "الرياضيات", teacher: "أ. سارة إبراهيم",
    icon: Calculator, color: "amber",
    exams: [
      { name: "الامتحان الشهري — الجبر",   score: 92, total: 100, date: "10 مارس",   type: "امتحان شامل" },
      { name: "كويز المعادلات التربيعية",   score: 18, total: 20,  date: "6 مارس",    type: "كويز"        },
      { name: "واجب الهندسة التحليلية",    score: 17, total: 20,  date: "3 مارس",    type: "واجب"        },
      { name: "كويز التفاضل",              score: 8,  total: 10,  date: "28 فبراير", type: "كويز"        },
    ],
  },
  {
    id: 2, name: "اللغة العربية", teacher: "أ. محمد رضا",
    icon: BookOpen, color: "orange",
    exams: [
      { name: "الامتحان الشامل — النحو",   score: 88, total: 100, date: "9 مارس",    type: "امتحان شامل" },
      { name: "كويز البلاغة",              score: 16, total: 20,  date: "5 مارس",    type: "كويز"        },
      { name: "الواجب",      score: 19, total: 20,  date: "28 فبراير", type: "واجب"        },
      { name: "كويز الإملاء",              score: 9,  total: 10,  date: "20 فبراير", type: "كويز"        },
    ],
  },
  {
    id: 3, name: "العلوم", teacher: "أ. نهى خالد",
    icon: FlaskConical, color: "emerald",
    exams: [
      { name: "الامتحان الشامل — الفيزياء",score: 90, total: 100, date: "8 مارس",    type: "امتحان شامل" },
      { name: "كويز الكيمياء",             score: 14, total: 20,  date: "4 مارس",    type: "كويز"        },
      { name: "الواجب",        score: 18, total: 20,  date: "27 فبراير", type: "واجب"        },
      { name: "كويز الأحياء",              score: 8,  total: 10,  date: "22 فبراير", type: "كويز"        },
    ],
  },
  {
    id: 4, name: "الإنجليزية", teacher: "أ. عمر طارق",
    icon: Globe, color: "blue",
    exams: [
      { name: "Final Exam — Grammar",      score: 70, total: 100, date: "7 مارس",    type: "امتحان شامل" },
      { name: "Quiz — Vocabulary",         score: 17, total: 20,  date: "3 مارس",    type: "كويز"        },
      { name: "Homework — Writing Essay",  score: 15, total: 20,  date: "25 فبراير", type: "واجب"        },
      { name: "Quiz — Reading",            score: 8,  total: 10,  date: "18 فبراير", type: "كويز"        },
    ],
  },
];

// ─── Color maps (Tailwind only) ───────────────────────────────────────────────
const COLOR_MAP: Record<string, {
  iconBg: string; iconText: string; iconBorder: string;
  bar: string; badgeBg: string; badgeText: string; badgeBorder: string;
  cardBorder: string; glow: string;
}> = {
  amber:   { iconBg:"bg-amber-50",   iconText:"text-amber-600",   iconBorder:"border-amber-200",   bar:"bg-amber-500",   badgeBg:"bg-amber-50",   badgeText:"text-amber-700",   badgeBorder:"border-amber-200",   cardBorder:"border-amber-100", glow:"shadow-amber-100"   },
  orange:  { iconBg:"bg-orange-50",  iconText:"text-orange-600",  iconBorder:"border-orange-200",  bar:"bg-orange-500",  badgeBg:"bg-orange-50",  badgeText:"text-orange-700",  badgeBorder:"border-orange-200",  cardBorder:"border-orange-100",glow:"shadow-orange-100"  },
  emerald: { iconBg:"bg-emerald-50", iconText:"text-emerald-600", iconBorder:"border-emerald-200", bar:"bg-emerald-500", badgeBg:"bg-emerald-50", badgeText:"text-emerald-700", badgeBorder:"border-emerald-200", cardBorder:"border-emerald-100",glow:"shadow-emerald-100"},
  blue:    { iconBg:"bg-blue-50",    iconText:"text-blue-600",    iconBorder:"border-blue-200",    bar:"bg-blue-500",    badgeBg:"bg-blue-50",    badgeText:"text-blue-700",    badgeBorder:"border-blue-200",    cardBorder:"border-blue-100",  glow:"shadow-blue-100"    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pct  = (s: number, t: number) => Math.round((s / t) * 100);
const avg  = (exams: Exam[])        => Math.round(exams.reduce((a, e) => a + pct(e.score, e.total), 0) / exams.length);

function grade(p: number): { label: string; bg: string; text: string; border: string } {
  if (p >= 90) return { label:"ممتاز",    bg:"bg-emerald-50", text:"text-emerald-700", border:"border-emerald-200" };
  if (p >= 80) return { label:"جيد جداً", bg:"bg-amber-50",   text:"text-amber-700",   border:"border-amber-200"   };
  if (p >= 70) return { label:"جيد",      bg:"bg-orange-50",  text:"text-orange-700",  border:"border-orange-200"  };
  if (p >= 60) return { label:"مقبول",    bg:"bg-yellow-50",  text:"text-yellow-700",  border:"border-yellow-200"  };
  return              { label:"ضعيف",     bg:"bg-red-50",     text:"text-red-600",     border:"border-red-200"     };
}

function scoreBar(p: number) {
  if (p >= 90) return "bg-emerald-500";
  if (p >= 80) return "bg-amber-500";
  if (p >= 70) return "bg-orange-400";
  if (p >= 60) return "bg-yellow-400";
  return "bg-red-400";
}

const TYPE_STYLE: Record<string, { pill: string; icon: React.ElementType; weight: string }> = {
  "امتحان شامل": { pill: "bg-amber-100  text-amber-800  border-amber-300",  icon: GraduationCap, weight: "الأعلى وزناً"   },
  "كويز":        { pill: "bg-orange-100 text-orange-700 border-orange-300", icon: Sparkles,      weight: "وزن متوسط"      },
  "واجب":        { pill: "bg-slate-100  text-slate-600  border-slate-300",  icon: BookOpen,      weight: "اختياري"        },
};

// ─── SVG Ring ─────────────────────────────────────────────────────────────────
function Ring({ pct: p, size = 60, stroke = 6, color }: {
  pct: number; size?: number; stroke?: number; color: string;
}) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ * (1 - p / 100);
  const col  = color === "amber" ? "#f59e0b" : color === "orange" ? "#f97316"
             : color === "emerald" ? "#10b981" : "#3b82f6";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
              strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }} />
    </svg>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ subject, delay }: { subject: Subject; delay: number }) {
  const [open, setOpen] = useState(false);
  const c        = COLOR_MAP[subject.color];
  const Icon     = subject.icon;
  const average  = avg(subject.exams);
  const gl       = grade(average);
  const sorted   = [...subject.exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastPct  = pct(sorted[0].score, sorted[0].total);
  const prevPct  = sorted[1] ? pct(sorted[1].score, sorted[1].total) : lastPct;
  const trend    = lastPct - prevPct;

  return (
    <div
      className={`fu bg-white rounded-2xl border ${c.cardBorder} overflow-hidden
                  hover:shadow-lg ${c.glow} transition-all duration-300`}
      style={{ animationDelay: `${delay}ms`, boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}
    >
      {/* ── Card header ──────────────────────────────────────────────── */}
      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Icon */}
          <div className={`w-12 h-12 rounded-2xl ${c.iconBg} border ${c.iconBorder}
                           flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} className={c.iconText} strokeWidth={1.8} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-black text-slate-800 text-base leading-tight">{subject.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{subject.teacher}</p>
              </div>

              {/* Ring */}
              <div className="relative flex-shrink-0">
                <Ring pct={average} color={subject.color} size={56} stroke={5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-black text-slate-700">{average}%</span>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${gl.bg} ${gl.text} ${gl.border}`}>
                {gl.label}
              </span>

              {trend !== 0 && (
                <span className={`flex items-center gap-1 text-[11px] font-bold
                                  ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {trend > 0
                    ? <TrendingUp  size={12} strokeWidth={2.5} />
                    : <TrendingDown size={12} strokeWidth={2.5} />
                  }
                  {trend > 0 ? `+${trend}` : trend}%
                </span>
              )}

              <span className="mr-auto text-[11px] text-slate-400">
                {subject.exams.length} تقييمات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Expand toggle ────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-3 border-t
                    text-xs font-bold transition-all duration-200
                    ${c.cardBorder}
                    ${open ? `${c.iconBg} ${c.iconText}` : "bg-slate-50/60 text-slate-400 hover:bg-slate-100/80"}`}
      >
        <span>{open ? "إخفاء التفاصيل" : "عرض التفاصيل"}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* ── Expanded exams ───────────────────────────────────────────── */}
      {open && (
        <div className="px-5 pt-4 pb-5 space-y-4 border-t border-slate-50">
          {subject.exams.map((exam, i) => {
            const p   = pct(exam.score, exam.total);
            const gl  = grade(p);
            const ts  = TYPE_STYLE[exam.type];
            const TIcon = ts.icon;
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${ts.pill}`}>
                      <TIcon size={9} strokeWidth={2.5} />
                      {exam.type}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 truncate">{exam.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={9} />{exam.date}
                    </span>
                    <span className="text-xs font-black text-slate-700">
                      {exam.score}
                      <span className="text-slate-400 font-normal text-[10px]">/{exam.total}</span>
                    </span>
                    <span className={`text-[10px] font-black w-8 text-left ${gl.text}`}>{p}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${scoreBar(p)} rounded-full`}
                    style={{ width: `${p}%`, transition: "width 0.8s cubic-bezier(.22,1,.36,1)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const overallAvg = Math.round(SUBJECTS.reduce((s, sub) => s + avg(sub.exams), 0) / SUBJECTS.length);
  const gl         = grade(overallAvg);
  const totalExams = SUBJECTS.reduce((s, sub) => s + sub.exams.length, 0);
  const best       = [...SUBJECTS].sort((a, b) => avg(b.exams) - avg(a.exams))[0];
  const needWork   = [...SUBJECTS].sort((a, b) => avg(a.exams) - avg(b.exams))[0];

  return (
    <div
      className="min-h-screen bg-slate-50 pb-10"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
        @keyframes fu { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fu .45s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 40%, #f59e0b 100%)" }}
      >
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"22px 22px" }} />
        {/* Glow circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 left-1/3 w-40 h-40 rounded-full bg-amber-300/20 pointer-events-none" />

        <div className="relative px-5 pt-8 pb-6">
          {/* Top label */}
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={16} className="text-amber-200" />
            <p className="text-amber-200 text-xs font-semibold">سجل درجاتك</p>
          </div>

          {/* Main row */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white leading-none">
                {overallAvg}
                <span className="text-amber-300 text-xl">%</span>
              </h1>
              <p className="text-amber-100 font-bold text-lg mt-1">{gl.label}</p>
              <p className="text-amber-200 text-xs mt-1">{totalExams} تقييم مكتمل</p>
            </div>

            {/* Big ring */}
            <div className="relative flex-shrink-0">
              <svg width={100} height={100} style={{ transform:"rotate(-90deg)" }}>
                <circle cx={50} cy={50} r={42} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={7}/>
                <circle cx={50} cy={50} r={42} fill="none" stroke="white" strokeWidth={7}
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - overallAvg / 100)}
                        strokeLinecap="round"
                        style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Star size={24} className="text-white" fill="white" />
              </div>
            </div>
          </div>

          {/* 4 subject mini-stats */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {SUBJECTS.map(s => {
              const a   = avg(s.exams);
              const Icon = s.icon;
              return (
                <div key={s.id} className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
                  <Icon size={14} className="text-amber-200 mx-auto mb-1" />
                  <p className="text-white font-black text-sm">{a}%</p>
                  <p className="text-amber-200 text-[9px] mt-0.5 truncate">{s.name.split(" ")[0]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 space-y-4">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 fu" style={{ animationDelay:"0ms" }}>
          {[
            { label:"أعلى مادة",     val: best.name,    icon:Award,    bg:"bg-amber-50",   text:"text-amber-700",   border:"border-amber-100"  },
            { label:"تحتاج اهتمام",  val: needWork.name, icon:Target,   bg:"bg-orange-50",  text:"text-orange-700",  border:"border-orange-100" },
            { label:"إجمالي التقييمات",val:`${totalExams}`,icon:BarChart3,bg:"bg-slate-50",  text:"text-slate-700",   border:"border-slate-100"  },
          ].map(({ label, val, icon: Icon, bg, text, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-3.5`}
                 style={{ boxShadow:"0 1px 3px rgba(15,23,42,0.05)" }}>
              <Icon size={14} className={`${text} mb-2 opacity-80`} strokeWidth={1.8} />
              <p className={`text-sm font-black ${text} leading-tight truncate`}>{val}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{label}</p>
            </div>
          ))}
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between fu" style={{ animationDelay:"60ms" }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-amber-700 to-amber-400 rounded-full" />
            <h2 className="font-black text-slate-800 text-sm">الدرجات حسب المادة</h2>
          </div>
          <span className="text-xs text-slate-400">{SUBJECTS.length} مواد</span>
        </div>

        {/* Subject cards */}
        {SUBJECTS.map((subject, i) => (
          <SubjectCard key={subject.id} subject={subject} delay={80 + i * 60} />
        ))}
      </div>
    </div>
  );
}