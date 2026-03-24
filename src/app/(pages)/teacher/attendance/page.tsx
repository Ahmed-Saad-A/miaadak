"use client";

import { useState, useMemo, useCallback } from "react";
import {
  CalendarDays, ChevronDown, GraduationCap, Clock,
  AlertTriangle, CheckCircle2, Save, RotateCcw,
  CalendarCheck, ChevronLeft, ChevronRight, Users,
} from "lucide-react";
import { DataTable } from "@/components";
import type { ColDef } from "ag-grid-community";

// ─── Types ────────────────────────────────────────────────────────────────────
type AttStatus = "present" | "absent" | "late" | null;
type ActiveAttStatus = "present" | "absent" | "late";

interface Student { id: number; name: string; }
interface AttendanceRow { id: number; name: string; status: AttStatus; }
interface ClassGroup { id: number; name: string; schedule: string; students: Student[]; }

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CLASSES: ClassGroup[] = [
  {
    id: 1, name: "الصف الثالث إعدادي أ", schedule: "الأحد والثلاثاء 4 م",
    students: [
      { id: 1, name: "أحمد محمود السيد" }, { id: 2, name: "نور خالد إبراهيم" },
      { id: 3, name: "كريم سالم طارق" }, { id: 4, name: "ريم أحمد علي" },
      { id: 5, name: "يوسف عمر مصطفى" }, { id: 6, name: "سارة محمد فتحي" },
    ],
  },
  {
    id: 2, name: "الصف الثالث إعدادي ب", schedule: "الاثنين والأربعاء 5 م",
    students: [
      { id: 7, name: "مريم طارق حسن" }, { id: 8, name: "عمر إبراهيم ناصر" },
      { id: 9, name: "لينا سامي الشريف" }, { id: 10, name: "محمد علاء الدين" },
      { id: 11, name: "فريدة حسام النجار" },
    ],
  },
  {
    id: 3, name: "الصف الثاني إعدادي", schedule: "الخميس 3 م",
    students: [
      { id: 12, name: "حمزة وليد الغامدي" }, { id: 13, name: "دينا رامي الزهراني" },
      { id: 14, name: "زياد سعيد القحطاني" },
    ],
  },
];

const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function formatDate(d: Date) { return `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`; }
function dayName(d: Date) { return DAYS_AR[d.getDay()]; }

// ─── Cell renderers ───────────────────────────────────────────────────────────

// Student avatar + name
const NameCell = ({ data }: { data: AttendanceRow }) => {
  const initials = data.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("");
  const avatarGrad =
    data.status === "present" ? "from-emerald-400 to-emerald-500" :
      data.status === "absent" ? "from-red-400    to-red-500" :
        data.status === "late" ? "from-amber-400  to-amber-500" :
          "from-slate-300  to-slate-400";
  return (
    <div className="flex items-center gap-3 h-full">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
        <span className="text-[11px] font-black text-white">{initials}</span>
      </div>
      <p className="text-sm font-semibold text-slate-700 truncate">{data.name}</p>
    </div>
  );
};

// Status badge
const StatusBadgeCell = ({ data }: { data: AttendanceRow }) => {
  const cfg: Record<ActiveAttStatus, { label: string; cls: string }> = {
    present: { label: "حضر", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    absent: { label: "غائب", cls: "bg-red-50     text-red-600     border-red-200" },
    late: { label: "متأخر", cls: "bg-amber-50   text-amber-700   border-amber-200" },
  };
  if (!data.status) {
    return <span className="text-[11px] text-slate-400 font-semibold">لم يُسجَّل</span>;
  }
  const c = cfg[data.status];
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.cls}`}>
      {c.label}
    </span>
  );
};

// 3 action buttons — receives onStatusChange via cellRendererParams
interface StatusCellParams {
  data: AttendanceRow;
  onStatusChange: (id: number, val: ActiveAttStatus) => void;
}

const StatusCell = ({ data, onStatusChange }: StatusCellParams) => {
  const btns: { target: ActiveAttStatus; label: string; active: string; hover: string }[] = [
    { target: "present", label: "حضر", active: "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200", hover: "hover:border-emerald-400 hover:text-emerald-600" },
    { target: "late", label: "متأخر", active: "bg-amber-500   text-white border-amber-500   shadow-sm shadow-amber-200", hover: "hover:border-amber-400   hover:text-amber-600" },
    { target: "absent", label: "غاب", active: "bg-red-500     text-white border-red-500     shadow-sm shadow-red-200", hover: "hover:border-red-400     hover:text-red-500" },
  ];
  return (
    <div className="flex gap-1.5 items-center h-full">
      {btns.map(b => (
        <button
          key={b.target}
          onClick={() => onStatusChange(data.id, b.target)}
          className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all duration-200 flex-1
                      ${data.status === b.target
              ? b.active
              : `bg-white text-slate-400 border-slate-200 ${b.hover}`}`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
};

// ─── Session Attendance ────────────────────────────────────────────────────────
function SessionAttendance({ cls }: { cls: ClassGroup }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [saved, setSaved] = useState(false);

  // Row data owned here — status changes trigger re-render of DataTable
  const [rows, setRows] = useState<AttendanceRow[]>(
    cls.students.map(s => ({ id: s.id, name: s.name, status: null }))
  );

  // ── handlers ────────────────────────────────────────────────────────────────
  const changeStatus = useCallback((id: number, val: ActiveAttStatus) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: r.status === val ? null : val } : r));
    setSaved(false);
  }, []);

  const markAll = (val: ActiveAttStatus) => {
    setRows(prev => prev.map(r => ({ ...r, status: val })));
    setSaved(false);
  };

  const reset = () => {
    setRows(prev => prev.map(r => ({ ...r, status: null })));
    setSaved(false);
  };

  const prevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d); reset(); };
  const nextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d); reset(); };

  // ── stats ───────────────────────────────────────────────────────────────────
  const presentCount = rows.filter(r => r.status === "present").length;
  const absentCount = rows.filter(r => r.status === "absent").length;
  const lateCount = rows.filter(r => r.status === "late").length;
  const unsetCount = rows.filter(r => r.status === null).length;
  const total = rows.length;

  // ── columns ─────────────────────────────────────────────────────────────────
  const cols = useMemo<ColDef[]>(() => [
    {
      field: "name",
      headerName: "الطالب",
      flex: 2,
      minWidth: 180,
      cellRenderer: NameCell,
      sortable: true,
      comparator: (a: string, b: string) => a.localeCompare(b, "ar"),
    },
    {
      field: "status",
      headerName: "الحالة",
      flex: 1,
      minWidth: 120,
      cellRenderer: StatusBadgeCell,
      sortable: true,
    },
    {
      field: "id",
      headerName: "تسجيل الحضور",
      flex: 2.5,
      minWidth: 230,
      sortable: false,
      filter: false,
      cellRenderer: StatusCell,
      cellRendererParams: { onStatusChange: changeStatus },
    },
  ], [changeStatus]);

  return (
    <div className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>

      {/* ── Collapsible header ──────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-right hover:bg-slate-50/50 transition-colors"
      >
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-orange-500 to-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0 text-right">
          <p className="font-black text-slate-800 text-sm">{cls.name}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock size={9} />{cls.schedule} · {total} طالب
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {presentCount > 0 && <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">{presentCount} حضر</span>}
          {absentCount > 0 && <span className="text-[11px] font-bold text-red-500    bg-red-50    border border-red-100    px-2 py-0.5 rounded-lg">{absentCount} غاب</span>}
          {lateCount > 0 && <span className="text-[11px] font-bold text-amber-600  bg-amber-50  border border-amber-100  px-2 py-0.5 rounded-lg">{lateCount} متأخر</span>}
          {saved && <CheckCircle2 size={15} className="text-emerald-500" />}
        </div>
        <ChevronDown size={15} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      {open && (
        <div className="border-t border-slate-100">

          {/* Date picker */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/60 border-b border-slate-100">
            <button onClick={prevDay} className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-orange-300 flex items-center justify-center transition-all">
              <ChevronRight size={14} className="text-slate-500" />
            </button>
            <div className="text-center">
              <p className="font-black text-slate-800 text-sm">{formatDate(date)}</p>
              <p className="text-[11px] text-slate-400">{dayName(date)}</p>
            </div>
            <button onClick={nextDay} className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-orange-300 flex items-center justify-center transition-all">
              <ChevronLeft size={14} className="text-slate-500" />
            </button>
          </div>

          {/* Bulk actions */}
          <div className="px-4 py-3 flex items-center gap-2 flex-wrap border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">تعيين الكل:</span>
            <button onClick={() => markAll("present")}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all">
              حضور
            </button>
            <button onClick={() => markAll("absent")}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all">
              غياب
            </button>
            <button onClick={() => markAll("late")}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all">
              متأخر
            </button>
            <button onClick={reset}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 transition-all flex items-center gap-1 mr-auto">
              <RotateCcw size={11} /> إعادة تعيين
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 gap-0.5">
              <div className="bg-emerald-500 transition-all duration-500 rounded-r-full" style={{ width: `${(presentCount / total) * 100}%` }} />
              <div className="bg-amber-400   transition-all duration-500" style={{ width: `${(lateCount / total) * 100}%` }} />
              <div className="bg-red-400     transition-all duration-500 rounded-l-full" style={{ width: `${(absentCount / total) * 100}%` }} />
            </div>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="text-[10px] font-bold text-emerald-600">{presentCount} حضر</span>
              <span className="text-[10px] font-bold text-amber-600">{lateCount} متأخر</span>
              <span className="text-[10px] font-bold text-red-500">{absentCount} غائب</span>
              {unsetCount > 0 && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-auto">
                  <AlertTriangle size={9} className="text-amber-500" /> {unsetCount} لم يُسجَّل
                </span>
              )}
            </div>
          </div>

          {/* DataTable */}
          <div className="px-4 pb-1">
            <DataTable<AttendanceRow>
              rowData={rows}
              columnDefs={cols}
              showRefresh={false}
              showExport={false}
              accentColor="text-orange-600"
              badgeBg="bg-orange-50"
              badgeText="text-orange-700"
              height={rows.length * 54 + 60}
              pageSize={30}
              rtl
              defaultColDef={{ sortable: false, filter: false, resizable: false, suppressMovable: true }}
            />
          </div>

          {/* Save */}
          <div className="px-4 py-4">
            {unsetCount > 0 && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1.5 mb-3 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                <AlertTriangle size={11} /> {unsetCount} طالب لم يُسجَّل بعد — تأكد من إكمال السجل
              </p>
            )}
            <button
              onClick={() => setSaved(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all
                          ${saved
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-amber-600"}`}
            >
              {saved ? <><CheckCircle2 size={15} /> تم الحفظ</> : <><Save size={15} /> حفظ الغياب</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TeacherAttendance() {
  const today = new Date();
  const totalStudents = CLASSES.reduce((s, c) => s + c.students.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-10" dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fu .4s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#c2410c 0%,#ea580c 45%,#f97316 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative px-5 pt-7 pb-6">
          <p className="text-orange-200 text-xs font-semibold mb-1 flex items-center gap-1.5">
            <CalendarCheck size={12} /> تسجيل الحضور
          </p>
          <h1 className="text-2xl font-black text-white leading-none mb-1">الحضور والغياب</h1>
          <p className="text-orange-200 text-sm mb-4">{dayName(today)} — {formatDate(today)}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "الصفوف", value: String(CLASSES.length), icon: GraduationCap, sub: "صف مسجّل" },
              { label: "إجمالي الطلاب", value: String(totalStudents), icon: Users, sub: "في كل الصفوف" },
              { label: "جلسات اليوم", value: String(CLASSES.length), icon: CalendarDays, sub: "جلسة مجدولة" },
            ].map(({ label, value, icon: Icon, sub }) => (
              <div key={label} className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center">
                <Icon size={14} className="text-orange-200 mx-auto mb-1" strokeWidth={1.8} />
                <p className="text-white font-black text-lg leading-none">{value}</p>
                <p className="text-orange-200 text-[10px] mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="text-xs font-bold text-slate-500">دليل الألوان:</span>
          {[
            { c: "bg-emerald-500", l: "حضر" },
            { c: "bg-amber-400", l: "متأخر" },
            { c: "bg-red-400", l: "غاب" },
            { c: "bg-slate-200", l: "لم يُسجَّل" },
          ].map(({ c, l }) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${c}`} />
              <span className="text-[11px] font-semibold text-slate-600">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div className="px-4 pt-4 space-y-3">
        {CLASSES.map(cls => <SessionAttendance key={cls.id} cls={cls} />)}
      </div>
    </div>
  );
}