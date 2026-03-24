"use client";

import { useState } from "react";
import {
  ChevronRight, ChevronLeft, Bell, BellOff,
  Clock, BookOpen, CheckCircle2, XCircle,
  CalendarDays, PlayCircle, AlertCircle,
  Hourglass, Calendar, List, LayoutGrid,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type SessionStatus = "upcoming" | "live" | "done" | "cancelled";
type ViewMode = "week" | "list";

interface Session {
  id: number;
  subject: string;
  teacher: string;
  avatar: string;
  day: number;   // 0=Sun … 6=Sat
  date: string;  // "2026-03-08"
  startTime: string;
  endTime: string;
  status: SessionStatus;
  notifyBefore: number | null; // minutes, null = off
  color: "amber" | "orange" | "stone" | "yellow" | "red";
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
};

const SESSIONS: Session[] = [
  { id: 1, subject: "الرياضيات",       teacher: "أ. سارة إبراهيم", avatar: "س", day: today.getDay(),         date: fmt(today),          startTime: "16:00", endTime: "17:00", status: "live",      notifyBefore: 15,   color: "amber"  },
  { id: 2, subject: "اللغة العربية",   teacher: "أ. محمد رضا",     avatar: "م", day: addDays(today,1).getDay(), date: fmt(addDays(today,1)), startTime: "10:00", endTime: "11:00", status: "upcoming",  notifyBefore: 30,   color: "orange" },
  { id: 3, subject: "العلوم",          teacher: "أ. نهى خالد",     avatar: "ن", day: addDays(today,1).getDay(), date: fmt(addDays(today,1)), startTime: "14:00", endTime: "15:00", status: "upcoming",  notifyBefore: null, color: "stone"  },
  { id: 4, subject: "اللغة الإنجليزية",teacher: "أ. عمر طارق",    avatar: "ع", day: addDays(today,3).getDay(), date: fmt(addDays(today,3)), startTime: "11:00", endTime: "12:00", status: "upcoming",  notifyBefore: 60,   color: "yellow" },
  { id: 5, subject: "الرياضيات",       teacher: "أ. سارة إبراهيم", avatar: "س", day: addDays(today,-1).getDay(),date: fmt(addDays(today,-1)),startTime: "16:00", endTime: "17:00", status: "done",      notifyBefore: 15,   color: "amber"  },
  { id: 6, subject: "التاريخ",         teacher: "أ. لمياء حسن",    avatar: "ل", day: addDays(today,-2).getDay(),date: fmt(addDays(today,-2)),startTime: "09:00", endTime: "10:00", status: "cancelled", notifyBefore: null, color: "red"    },
  { id: 7, subject: "الفيزياء",        teacher: "أ. أحمد فؤاد",    avatar: "أ", day: addDays(today,5).getDay(), date: fmt(addDays(today,5)), startTime: "17:00", endTime: "18:30", status: "upcoming",  notifyBefore: 30,   color: "orange" },
];

const DAYS_AR = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

// ─── Color maps ───────────────────────────────────────────────────────────────
const C = {
  amber:  { bg: "bg-amber-50",  border: "border-amber-200", text: "text-amber-700",  dot: "bg-amber-400",  avatar: "from-amber-400 to-amber-500"  },
  orange: { bg: "bg-orange-50", border: "border-orange-200",text: "text-orange-700", dot: "bg-orange-400", avatar: "from-orange-400 to-orange-500" },
  stone:  { bg: "bg-stone-50",  border: "border-stone-200", text: "text-stone-700",  dot: "bg-stone-400",  avatar: "from-stone-400 to-stone-500"   },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200",text: "text-yellow-700", dot: "bg-yellow-400", avatar: "from-yellow-400 to-yellow-500" },
  red:    { bg: "bg-red-50",    border: "border-red-200",   text: "text-red-600",    dot: "bg-red-400",    avatar: "from-red-400 to-red-400"       },
};

const STATUS_CONFIG = {
  live:      { label: "جارٍ الآن",  icon: PlayCircle,   cls: "bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse" },
  upcoming:  { label: "قادم",       icon: Hourglass,    cls: "bg-amber-50 text-amber-600 border-amber-200"     },
  done:      { label: "مكتمل",      icon: CheckCircle2, cls: "bg-slate-100 text-slate-500 border-slate-200"    },
  cancelled: { label: "ملغي",       icon: XCircle,      cls: "bg-red-50 text-red-500 border-red-200"           },
};

// ─── Notify Badge ──────────────────────────────────────────────────────────────
function NotifyBadge({ minutes, onToggle }: { minutes: number | null; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={minutes ? `تذكير قبل ${minutes} دقيقة` : "لا يوجد تذكير"}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all
                  ${minutes
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                  }`}
    >
      {minutes ? <Bell size={10} /> : <BellOff size={10} />}
      {minutes ? `${minutes} د` : "تذكير"}
    </button>
  );
}

// ─── Session Card (list view) ──────────────────────────────────────────────────
function SessionCard({ session, onToggleNotify }: {
  session: Session;
  onToggleNotify: (id: number) => void;
}) {
  const c = C[session.color];
  const s = STATUS_CONFIG[session.status];
  const { icon: StatusIcon } = s;
  const isPast = session.status === "done" || session.status === "cancelled";

  return (
    <div className={`flex gap-3 p-4 rounded-2xl border transition-all
                     ${isPast ? "opacity-60" : "hover:shadow-md"}
                     ${c.bg} ${c.border}`}>

      {/* Time column */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 w-12 pt-0.5">
        <span className={`text-xs font-black ${c.text}`}>{session.startTime}</span>
        <div className="flex-1 w-px bg-current opacity-20 min-h-[20px]" />
        <span className="text-[10px] text-slate-400">{session.endTime}</span>
      </div>

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl flex-shrink-0 bg-gradient-to-br ${c.avatar}
                       flex items-center justify-center text-white font-black text-sm shadow-sm`}>
        {session.avatar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">{session.subject}</p>
            <p className="text-xs text-slate-500 truncate">{session.teacher}</p>
          </div>
          {/* Status badge */}
          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${s.cls}`}>
            <StatusIcon size={9} />
            {s.label}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} />
            {session.startTime} — {session.endTime}
          </span>
          {session.status === "upcoming" || session.status === "live" ? (
            <NotifyBadge
              minutes={session.notifyBefore}
              onToggle={() => onToggleNotify(session.id)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Week strip ───────────────────────────────────────────────────────────────
function WeekStrip({ weekStart, selected, onSelect, sessions }: {
  weekStart: Date;
  selected: string;
  onSelect: (d: string) => void;
  sessions: Session[];
}) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, i) => {
        const d = addDays(weekStart, i);
        const key = fmt(d);
        const isToday = key === fmt(today);
        const isSelected = key === selected;
        const hasSessions = sessions.some(s => s.date === key);

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                        ${isSelected
                          ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                          : isToday
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "hover:bg-slate-50 text-slate-500"
                        }`}
          >
            <span className="text-[10px] font-semibold">
              {DAYS_AR[d.getDay()].slice(0, 3)}
            </span>
            <span className={`text-sm font-black ${isSelected ? "text-white" : isToday ? "text-amber-600" : "text-slate-700"}`}>
              {d.getDate()}
            </span>
            {hasSessions && (
              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-amber-400"}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [view, setView] = useState<ViewMode>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(fmt(today));
  const [notifyOptions] = useState([15, 30, 60]);
  const [notifyPickFor, setNotifyPickFor] = useState<number | null>(null);

  // Week start (Sunday)
  const weekStart = addDays(today, weekOffset * 7 - today.getDay());
  const weekEnd   = addDays(weekStart, 6);

  const weekLabel = `${weekStart.getDate()} ${MONTHS_AR[weekStart.getMonth()]} — ${weekEnd.getDate()} ${MONTHS_AR[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  // Sessions for selected day
  const dayLabel = (() => {
    const d = new Date(selectedDate);
    const diff = Math.round((d.getTime() - today.setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return "اليوم";
    if (diff === 1) return "غداً";
    if (diff === -1) return "أمس";
    return `${DAYS_AR[d.getDay()]}، ${d.getDate()} ${MONTHS_AR[d.getMonth()]}`;
  })();

  const daySessions = sessions
    .filter(s => s.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // All upcoming (sorted)
  const upcomingSessions = sessions
    .filter(s => s.status === "upcoming" || s.status === "live")
    .sort((a, b) => a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date));

  // Toggle notify
  const toggleNotify = (id: number) => {
    const s = sessions.find(s => s.id === id);
    if (!s) return;
    if (s.notifyBefore !== null) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, notifyBefore: null } : s));
    } else {
      setNotifyPickFor(id);
    }
  };

  const setNotifyMinutes = (id: number, min: number) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, notifyBefore: min } : s));
    setNotifyPickFor(null);
  };

  // Stats
  const stats = {
    total:     sessions.length,
    done:      sessions.filter(s => s.status === "done").length,
    upcoming:  sessions.filter(s => s.status === "upcoming").length,
    live:      sessions.filter(s => s.status === "live").length,
  };

  return (
    <div
      className="min-h-screen bg-slate-50 p-5 space-y-4"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Notify picker overlay */}
      {notifyPickFor !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setNotifyPickFor(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl p-5 shadow-2xl w-64" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-amber-500" />
              <p className="font-bold text-slate-700 text-sm">اختر وقت التذكير</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {notifyOptions.map(min => (
                <button
                  key={min}
                  onClick={() => setNotifyMinutes(notifyPickFor, min)}
                  className="py-2.5 rounded-xl bg-amber-50 border border-amber-200
                             text-amber-700 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
                >
                  {min} دقيقة
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-slate-800">جدولي الدراسي</h1>
          <p className="text-slate-400 text-xs mt-0.5">تتبع جلساتك وفعّل التذكيرات</p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
          {([["week", Calendar, "أسبوعي"], ["list", List, "قائمة"]] as const).map(([v, Icon, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                          ${view === v ? "bg-amber-500 text-white shadow-sm" : "text-slate-500 hover:text-amber-600"}`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "الكل",    value: stats.total,    icon: CalendarDays,  cls: "text-slate-500",   bg: "bg-slate-50",    border: "border-slate-100" },
          { label: "قادمة",   value: stats.upcoming, icon: Hourglass,     cls: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-100" },
          { label: "جارية",   value: stats.live,     icon: PlayCircle,    cls: "text-emerald-500", bg: "bg-emerald-50",  border: "border-emerald-100" },
          { label: "مكتملة",  value: stats.done,     icon: CheckCircle2,  cls: "text-slate-400",   bg: "bg-slate-50",    border: "border-slate-100" },
        ].map(({ label, value, icon: Icon, cls, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-3 text-center`}
               style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Icon size={14} className={`${cls} mx-auto mb-1`} strokeWidth={1.8} />
            <p className={`text-lg font-black ${cls}`}>{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Week / List view ──────────────────────────────────────────────────── */}
      {view === "week" ? (
        <div className="space-y-4">
          {/* Week navigator */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3"
               style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
            <div className="flex items-center justify-between">
              <button onClick={() => setWeekOffset(w => w - 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ChevronRight size={18} />
              </button>
              <p className="text-xs font-bold text-slate-600">{weekLabel}</p>
              <button onClick={() => setWeekOffset(w => w + 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <ChevronLeft size={18} />
              </button>
            </div>
            <WeekStrip
              weekStart={weekStart}
              selected={selectedDate}
              onSelect={setSelectedDate}
              sessions={sessions}
            />
          </div>

          {/* Day sessions */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
               style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <CalendarDays size={15} className="text-amber-500" />
              <h2 className="font-bold text-slate-700 text-sm">
                {dayLabel}
                {daySessions.length > 0 && (
                  <span className="mr-2 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    {daySessions.length} جلسات
                  </span>
                )}
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {daySessions.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2 text-slate-300">
                  <BookOpen size={36} strokeWidth={1} />
                  <p className="text-sm font-medium">لا توجد جلسات هذا اليوم</p>
                </div>
              ) : (
                daySessions.map(s => (
                  <SessionCard key={s.id} session={s} onToggleNotify={toggleNotify} />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List view: upcoming only */
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
             style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-500" />
            <h2 className="font-bold text-slate-700 text-sm">الجلسات القادمة</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
              {upcomingSessions.length}
            </span>
          </div>

          {/* Group by date */}
          <div className="p-4 space-y-5">
            {upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-2 text-slate-300">
                <CheckCircle2 size={36} strokeWidth={1} />
                <p className="text-sm font-medium">لا توجد جلسات قادمة</p>
              </div>
            ) : (
              Object.entries(
                upcomingSessions.reduce<Record<string, Session[]>>((acc, s) => {
                  (acc[s.date] = acc[s.date] || []).push(s); return acc;
                }, {})
              ).map(([date, group]) => {
                const d = new Date(date);
                const diff = Math.round((d.getTime() - new Date().setHours(0,0,0,0)) / 86400000);
                const label = diff === 0 ? "اليوم" : diff === 1 ? "غداً" : `${DAYS_AR[d.getDay()]}، ${d.getDate()} ${MONTHS_AR[d.getMonth()]}`;
                return (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg
                                        ${diff === 0 ? "bg-amber-500 text-white" : diff === 1 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600"}`}>
                        {label}
                      </span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>
                    <div className="space-y-2">
                      {group.map(s => <SessionCard key={s.id} session={s} onToggleNotify={toggleNotify} />)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Notification tip ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
        <Bell size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-700 mb-0.5">فعّل التذكيرات على جلساتك</p>
          <p className="text-[11px] text-amber-600 leading-relaxed">
  اضغط على زر {"تذكير"} في أي جلسة قادمة لتفعيل إشعار قبل بدء الجلسة بـ 15 أو 30 أو 60 دقيقة.
</p>
        </div>
      </div>
    </div>
  );
}