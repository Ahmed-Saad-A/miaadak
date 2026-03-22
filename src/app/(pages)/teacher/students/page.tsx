"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Users, GraduationCap, AlertTriangle, CalendarCheck,
  UserPlus, Trash2, Plus, X, Phone, ChevronDown,
  TrendingUp, TrendingDown, CheckCircle2, Clock,
} from "lucide-react";
import { DataTable } from "@/components";
import type { ColDef, IRowNode } from "ag-grid-community";

// ─── Types ────────────────────────────────────────────────────────────────────
type AttendanceStatus = "excellent" | "good" | "warning" | "danger";

interface Student {
  id: number;
  name: string;
  parentPhone: string;
  sessionsTotal: number;
  sessionsAttended: number;
  avgGrade: number;
  lastSeen: string;
  status: AttendanceStatus;
  trend: "up" | "down" | "stable";
}

interface ClassGroup {
  id: number;
  name: string;
  subject: string;
  schedule: string;
  students: Student[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 1, name: "الصف الثالث إعدادي أ", subject: "الرياضيات", schedule: "الأحد والثلاثاء 4 م",
    students: [
      { id: 1, name: "أحمد محمود السيد", parentPhone: "0101234567", sessionsTotal: 20, sessionsAttended: 20, avgGrade: 94, lastSeen: "اليوم", status: "excellent", trend: "up" },
      { id: 2, name: "نور خالد إبراهيم", parentPhone: "0112345678", sessionsTotal: 20, sessionsAttended: 18, avgGrade: 87, lastSeen: "اليوم", status: "good", trend: "up" },
      { id: 3, name: "كريم سالم طارق", parentPhone: "0123456789", sessionsTotal: 20, sessionsAttended: 14, avgGrade: 72, lastSeen: "أمس", status: "warning", trend: "down" },
      { id: 4, name: "ريم أحمد علي", parentPhone: "0154567890", sessionsTotal: 20, sessionsAttended: 19, avgGrade: 91, lastSeen: "اليوم", status: "excellent", trend: "stable" },
      { id: 5, name: "يوسف عمر مصطفى", parentPhone: "0105678901", sessionsTotal: 20, sessionsAttended: 10, avgGrade: 58, lastSeen: "منذ 3 أيام", status: "danger", trend: "down" },
      { id: 6, name: "سارة محمد فتحي", parentPhone: "0116789012", sessionsTotal: 20, sessionsAttended: 17, avgGrade: 83, lastSeen: "أمس", status: "good", trend: "stable" },
    ],
  },
  {
    id: 2, name: "الصف الثالث إعدادي ب", subject: "الرياضيات", schedule: "الاثنين والأربعاء 5 م",
    students: [
      { id: 7, name: "مريم طارق حسن", parentPhone: "0127890123", sessionsTotal: 18, sessionsAttended: 18, avgGrade: 96, lastSeen: "اليوم", status: "excellent", trend: "up" },
      { id: 8, name: "عمر إبراهيم ناصر", parentPhone: "0158901234", sessionsTotal: 18, sessionsAttended: 15, avgGrade: 78, lastSeen: "أمس", status: "good", trend: "up" },
      { id: 9, name: "لينا سامي الشريف", parentPhone: "0109012345", sessionsTotal: 18, sessionsAttended: 11, avgGrade: 65, lastSeen: "منذ يومين", status: "warning", trend: "down" },
      { id: 10, name: "محمد علاء الدين", parentPhone: "0110123456", sessionsTotal: 18, sessionsAttended: 16, avgGrade: 85, lastSeen: "اليوم", status: "good", trend: "stable" },
      { id: 11, name: "فريدة حسام النجار", parentPhone: "0121234567", sessionsTotal: 18, sessionsAttended: 7, avgGrade: 45, lastSeen: "منذ أسبوع", status: "danger", trend: "down" },
    ],
  },
  {
    id: 3, name: "الصف الثاني إعدادي", subject: "الرياضيات", schedule: "الخميس 3 م",
    students: [
      { id: 12, name: "حمزة وليد الغامدي", parentPhone: "0152345678", sessionsTotal: 15, sessionsAttended: 15, avgGrade: 89, lastSeen: "اليوم", status: "excellent", trend: "up" },
      { id: 13, name: "دينا رامي الزهراني", parentPhone: "0103456789", sessionsTotal: 15, sessionsAttended: 13, avgGrade: 77, lastSeen: "أمس", status: "good", trend: "stable" },
      { id: 14, name: "زياد سعيد القحطاني", parentPhone: "0114567890", sessionsTotal: 15, sessionsAttended: 9, avgGrade: 61, lastSeen: "منذ 4 أيام", status: "warning", trend: "down" },
    ],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const SM: Record<AttendanceStatus, { label: string; dot: string; badge: string }> = {
  excellent: { label: "ممتاز", dot: "#10b981", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  good: { label: "جيد", dot: "#f59e0b", badge: "bg-amber-50   text-amber-700   border border-amber-200" },
  warning: { label: "تحذير", dot: "#f97316", badge: "bg-orange-50  text-orange-700  border border-orange-200" },
  danger: { label: "خطر", dot: "#ef4444", badge: "bg-red-50     text-red-600     border border-red-200" },
};

// ─── Cell Renderers ───────────────────────────────────────────────────────────
const NameCell = ({ value, data }: { value: string; data: Student }) => {
  const initials = value.split(" ").slice(0, 2).map((w: string) => w[0]).join("");
  const sm = SM[data.status];
  return (
    <div className="flex items-center gap-2.5 h-full">
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
          <span className="text-[11px] font-black text-white">{initials}</span>
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
          style={{ background: sm.dot }} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate leading-tight">{value}</p>
        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={8} />{data.lastSeen}</p>
      </div>
    </div>
  );
};

const AttendanceCell = ({ data }: { data: Student }) => {
  const pct = data.sessionsTotal > 0 ? Math.round((data.sessionsAttended / data.sessionsTotal) * 100) : 0;
  const color = pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : pct >= 60 ? "#f97316" : "#ef4444";
  return (
    <div className="flex items-center gap-2 h-full">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-black flex-shrink-0 w-8 text-left" style={{ color }}>{pct}%</span>
    </div>
  );
};

const GradeCell = ({ data }: { data: Student }) => {
  const g = data.avgGrade;
  if (g === 0) return <span className="text-slate-400 text-sm h-full flex items-center">—</span>;
  const color = g >= 90 ? "text-emerald-700" : g >= 75 ? "text-amber-700" : g >= 60 ? "text-orange-600" : "text-red-600";
  const label = g >= 90 ? "ممتاز" : g >= 80 ? "جيد جداً" : g >= 70 ? "جيد" : g >= 60 ? "مقبول" : "ضعيف";
  return (
    <div className="h-full flex items-center gap-2">
      <span className={`text-sm font-black ${color}`}>{g}%</span>
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border bg-slate-50 text-slate-500 border-slate-200">{label}</span>
    </div>
  );
};

const StatusCell = ({ data }: { data: Student }) => {
  const sm = SM[data.status];
  return (
    <div className="h-full flex items-center gap-2">
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sm.badge}`}>{sm.label}</span>
      {data.trend === "up" && <TrendingUp size={13} className="text-emerald-500 flex-shrink-0" />}
      {data.trend === "down" && <TrendingDown size={13} className="text-red-400    flex-shrink-0" />}
      {data.trend === "stable" && <CheckCircle2 size={13} className="text-slate-400  flex-shrink-0" />}
    </div>
  );
};

const SessionsCell = ({ data }: { data: Student }) => {
  const absent = data.sessionsTotal - data.sessionsAttended;
  return (
    <div className="h-full flex items-center gap-3 text-xs">
      <span className="flex items-center gap-1 font-bold text-emerald-700">
        <CalendarCheck size={11} />{data.sessionsAttended}
      </span>
      <span className="text-slate-200">|</span>
      <span className={`font-bold ${absent === 0 ? "text-slate-400" : absent <= 2 ? "text-amber-600" : "text-red-500"}`}>
        {absent} غياب
      </span>
    </div>
  );
};

const PhoneCell = ({ data }: { data: Student }) => (
  <a href={`tel:${data.parentPhone}`}
    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl
               bg-orange-50 border border-orange-200 text-orange-700
               hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
    onClick={e => e.stopPropagation()}>
    <Phone size={11} />{data.parentPhone}
  </a>
);

// ─── Add Modal ────────────────────────────────────────────────────────────────
function AddModal({ classId, className, onAdd, onClose }: {
  classId: number; className: string;
  onAdd: (cid: number, s: Student) => void; onClose: () => void;
}) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [err, setErr] = useState("");
  const submit = () => {
    if (!name.trim()) { setErr("اسم الطالب مطلوب"); return; }
    if (!phone.trim()) { setErr("رقم ولي الأمر مطلوب"); return; }
    onAdd(classId, { id: Date.now(), name: name.trim(), parentPhone: phone.trim(), sessionsTotal: 0, sessionsAttended: 0, avgGrade: 0, lastSeen: "لم يحضر بعد", status: "good", trend: "stable" });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div><p className="font-black text-slate-800">إضافة طالب</p><p className="text-xs text-slate-400 mt-0.5">{className}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"><X size={15} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">اسم الطالب</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">رقم ولي الأمر</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01xxxxxxxxx" type="tel" dir="ltr"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 transition-all" />
          </div>
          {err && <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-xl border border-red-100"><AlertTriangle size={11} />{err}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={submit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-md shadow-orange-200"><Plus size={14} /> إضافة</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ─── Del Modal ────────────────────────────────────────────────────────────────
function DelModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto"><Trash2 size={22} className="text-red-500" /></div>
        <div><p className="font-black text-slate-800">حذف الطالب</p><p className="text-slate-500 text-sm mt-1">هل أنت متأكد من حذف <span className="font-bold text-slate-700">{name}</span>؟</p></div>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all">تأكيد</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ─── Class Section ────────────────────────────────────────────────────────────
function ClassSection({ cls, onAdd, onDel }: {
  cls: ClassGroup; onAdd: (cid: number, s: Student) => void; onDel: (cid: number, sid: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [delTarget, setDelTarget] = useState<Student | null>(null);

  const handleDelete = useCallback((id: number) => {
    setDelTarget(cls.students.find(s => s.id === id) ?? null);
  }, [cls.students]);

  const cols = useMemo<ColDef[]>(() => [
    {
      field: "name", headerName: "الطالب", flex: 2, minWidth: 190,
      cellRenderer: NameCell,
      comparator: (a: string, b: string) => a.localeCompare(b, "ar"),
    },
    {
      field: "sessionsAttended", headerName: "الحضور", flex: 1.5, minWidth: 140,
      cellRenderer: AttendanceCell,
      comparator: (_a: number, _b: number, na: IRowNode<Student>, nb: IRowNode<Student>) => {
        const pa = (na.data?.sessionsTotal ?? 0) > 0 ? (na.data!.sessionsAttended / na.data!.sessionsTotal) : 0;
        const pb = (nb.data?.sessionsTotal ?? 0) > 0 ? (nb.data!.sessionsAttended / nb.data!.sessionsTotal) : 0;
        return pa - pb;
      },
    },
    {
      field: "avgGrade", headerName: "المعدل", flex: 1.4, minWidth: 140,
      cellRenderer: GradeCell,
      comparator: (a: number, b: number) => a - b,
    },
    {
      field: "status", headerName: "الحالة", flex: 1.3, minWidth: 140,
      cellRenderer: StatusCell,
    },
    {
      field: "sessionsTotal", headerName: "الجلسات", flex: 1.3, minWidth: 140,
      cellRenderer: SessionsCell,
    },
    {
      field: "parentPhone", headerName: "ولي الأمر", flex: 1.5, minWidth: 160,
      cellRenderer: PhoneCell,
    },
    {
      headerName: "", width: 52, sortable: false, filter: false, resizable: false,
      cellRenderer: ({ data }: { data: Student }) => (
        <div className="h-full flex items-center justify-center">
          <button
            onClick={e => { e.stopPropagation(); handleDelete(data.id); }}
            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500
                       flex items-center justify-center transition-all group">
            <Trash2 size={12} className="text-red-400 group-hover:text-white" />
          </button>
        </div>
      ),
    },
  ], [handleDelete]);

  const avgAtt = cls.students.length > 0
    ? Math.round(cls.students.reduce((a, s) => a + (s.sessionsTotal > 0 ? (s.sessionsAttended / s.sessionsTotal) * 100 : 0), 0) / cls.students.length)
    : 0;
  const atRisk = cls.students.filter(s => s.status === "danger").length;
  const gridH = Math.min(cls.students.length * 54 + 110, 450);

  return (
    <>
      {addModal && <AddModal classId={cls.id} className={cls.name} onAdd={onAdd} onClose={() => setAddModal(false)} />}
      {delTarget && (
        <DelModal
          name={delTarget.name}
          onConfirm={() => { onDel(cls.id, delTarget.id); setDelTarget(null); }}
          onClose={() => setDelTarget(null)}
        />
      )}

      <div className="fu space-y-3">
        {/* Class header row */}
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-right min-w-0">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-orange-500 to-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-black text-slate-800">{cls.name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">{cls.subject}</span>
                {atRisk > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center gap-1"><AlertTriangle size={9} />{atRisk} في خطر</span>}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock size={9} />{cls.schedule} · {cls.students.length} طالب · حضور {avgAtt}%
              </p>
            </div>
            <ChevronDown size={15} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
          </button>

          <button onClick={() => setAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
                       bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm shadow-orange-200 flex-shrink-0">
            <UserPlus size={13} /> إضافة طالب
          </button>
        </div>

        {/* DataTable */}
        {open && (
          <DataTable<Student>
            rowData={cls.students}
            columnDefs={cols}
            TitleIcon={Users}
            accentColor="text-orange-600"
            badgeBg="bg-orange-50"
            badgeText="text-orange-700"
            showRefresh={false}
            showExport
            height={gridH}
            pageSize={20}
            onRowClick={s => console.log("student clicked:", s.name)}
            headerActions={
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="text-emerald-600 font-bold">{cls.students.filter(s => s.status === "excellent").length} ممتاز</span>
                <span>·</span>
                <span className="text-red-500 font-bold">{cls.students.filter(s => s.status === "danger").length} في خطر</span>
              </div>
            }
          />
        )}
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TeacherStudents() {
  const [classes, setClasses] = useState<ClassGroup[]>(INITIAL_CLASSES);

  const addStudent = (cid: number, s: Student) =>
    setClasses(p => p.map(c => c.id === cid ? { ...c, students: [...c.students, s] } : c));

  const delStudent = (cid: number, sid: number) =>
    setClasses(p => p.map(c => c.id === cid ? { ...c, students: c.students.filter(s => s.id !== sid) } : c));

  const all = classes.flatMap(c => c.students);
  const total = all.length;
  const atRisk = all.filter(s => s.status === "danger").length;
  const avgAtt = total > 0 ? Math.round(all.reduce((a, s) => a + (s.sessionsTotal > 0 ? (s.sessionsAttended / s.sessionsTotal) * 100 : 0), 0) / total) : 0;

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
            <GraduationCap size={12} /> إدارة الطلاب
          </p>
          <h1 className="text-2xl font-black text-white leading-none mb-4">طلابي</h1>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "إجمالي الطلاب", value: String(total), icon: Users, sub: `${classes.length} صفوف` },
              { label: "متوسط الحضور", value: `${avgAtt}%`, icon: CalendarCheck, sub: "هذا الشهر" },
              { label: "يحتاجون تدخل", value: String(atRisk), icon: AlertTriangle, sub: "طالب في خطر" },
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

      {/* Classes with DataTable */}
      <div className="px-4 pt-5 space-y-8">
        {classes.map(cls => (
          <ClassSection key={cls.id} cls={cls} onAdd={addStudent} onDel={delStudent} />
        ))}
      </div>
    </div>
  );
}