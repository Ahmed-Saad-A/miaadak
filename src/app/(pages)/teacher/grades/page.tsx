"use client";

import { useState } from "react";
import {
  GraduationCap, ChevronDown, Plus, Trash2,
  Save, CheckCircle2, AlertTriangle, BookOpen,
  TrendingUp, X, BarChart3, Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ExamType = "امتحان شامل" | "كويز" | "واجب";

interface ExamRecord { id: number; studentId: number; score: number | null; }
interface Exam { id: number; name: string; type: ExamType; total: number; records: ExamRecord[]; }
interface Student { id: number; name: string; }
interface ClassGroup { id: number; name: string; schedule: string; students: Student[]; exams: Exam[]; }

// ─── Mock ─────────────────────────────────────────────────────────────────────
const INITIAL: ClassGroup[] = [
  {
    id: 1, name: "الصف الثالث إعدادي أ", schedule: "الأحد والثلاثاء",
    students: [
      { id: 1, name: "أحمد محمود السيد" }, { id: 2, name: "نور خالد إبراهيم" },
      { id: 3, name: "كريم سالم طارق" }, { id: 4, name: "ريم أحمد علي" },
      { id: 5, name: "يوسف عمر مصطفى" }, { id: 6, name: "سارة محمد فتحي" },
    ],
    exams: [
      {
        id: 1, name: "اختبار الجبر", type: "امتحان شامل", total: 100,
        records: [{ id: 1, studentId: 1, score: 92 }, { id: 2, studentId: 2, score: 87 }, { id: 3, studentId: 3, score: 72 }, { id: 4, studentId: 4, score: 91 }, { id: 5, studentId: 5, score: 58 }, { id: 6, studentId: 6, score: 83 }]
      },
      {
        id: 2, name: "كويز المعادلات", type: "كويز", total: 20,
        records: [{ id: 7, studentId: 1, score: 18 }, { id: 8, studentId: 2, score: 16 }, { id: 9, studentId: 3, score: 12 }, { id: 10, studentId: 4, score: 19 }, { id: 11, studentId: 5, score: 8 }, { id: 12, studentId: 6, score: 15 }]
      },
    ],
  },
  {
    id: 2, name: "الصف الثالث إعدادي ب", schedule: "الاثنين والأربعاء",
    students: [
      { id: 7, name: "مريم طارق حسن" }, { id: 8, name: "عمر إبراهيم ناصر" },
      { id: 9, name: "لينا سامي الشريف" }, { id: 10, name: "محمد علاء الدين" },
    ],
    exams: [
      {
        id: 3, name: "اختبار الفيزياء", type: "امتحان شامل", total: 100,
        records: [{ id: 13, studentId: 7, score: 96 }, { id: 14, studentId: 8, score: 78 }, { id: 15, studentId: 9, score: 65 }, { id: 16, studentId: 10, score: 85 }]
      },
    ],
  },
];

const TYPE_STYLE: Record<ExamType, { pill: string; dot: string }> = {
  "امتحان شامل": { pill: "bg-amber-100  text-amber-800  border-amber-300", dot: "bg-amber-500" },
  "كويز": { pill: "bg-orange-100 text-orange-700 border-orange-300", dot: "bg-orange-500" },
  "واجب": { pill: "bg-slate-100  text-slate-600  border-slate-300", dot: "bg-slate-400" },
};

function pct(score: number, total: number) { return Math.round((score / total) * 100); }
function gradeColor(p: number) { return p >= 90 ? "text-emerald-700" : p >= 75 ? "text-amber-700" : p >= 60 ? "text-orange-600" : "text-red-600"; }
function gradeLabel(p: number) { return p >= 90 ? "ممتاز" : p >= 80 ? "جيد جداً" : p >= 70 ? "جيد" : p >= 60 ? "مقبول" : "ضعيف"; }
function barColor(p: number) { return p >= 90 ? "bg-emerald-500" : p >= 75 ? "bg-amber-500" : p >= 60 ? "bg-orange-400" : "bg-red-400"; }

// ─── Add Exam Modal ───────────────────────────────────────────────────────────
function AddExamModal({ onAdd, onClose }: { onAdd: (e: Omit<Exam, "id" | "records">) => void; onClose: () => void }) {
  const [name, setName] = useState(""); const [type, setType] = useState<ExamType>("كويز");
  const [total, setTotal] = useState("20"); const [err, setErr] = useState("");
  const submit = () => {
    if (!name.trim()) { setErr("اسم الاختبار مطلوب"); return; }
    const t = Number(total);
    if (!t || t < 1) { setErr("الدرجة الكاملة يجب أن تكون أكبر من صفر"); return; }
    onAdd({ name: name.trim(), type, total: t });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <p className="font-black text-slate-800">إضافة اختبار جديد</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"><X size={15} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">اسم الاختبار</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: كويز المعادلات التربيعية"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">نوع الاختبار</label>
            <div className="flex gap-2">
              {(["امتحان شامل", "كويز", "واجب"] as ExamType[]).map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all
                    ${type === t ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-orange-200"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">الدرجة الكاملة</label>
            <input value={total} onChange={e => setTotal(e.target.value)} type="number" min="1" dir="ltr"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 transition-all" />
          </div>
          {err && <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-xl border border-red-100"><AlertTriangle size={11} />{err}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={submit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-md shadow-orange-200">
            <Plus size={14} /> إضافة
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition-all">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ─── Exam Table ────────────────────────────────────────────────────────────────
function ExamTable({ exam, students, onSave, onDelete }: {
  exam: Exam; students: Student[];
  onSave: (eid: number, records: ExamRecord[]) => void;
  onDelete: (eid: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<Record<number, string>>(
    Object.fromEntries(exam.records.map(r => [r.studentId, r.score != null ? String(r.score) : ""]))
  );
  const [saved, setSaved] = useState(true);

  const update = (sid: number, val: string) => { setScores(p => ({ ...p, [sid]: val })); setSaved(false); };

  const save = () => {
    const records: ExamRecord[] = students.map((s, i) => ({
      id: exam.records.find(r => r.studentId === s.id)?.id ?? Date.now() + i,
      studentId: s.id,
      score: scores[s.id] !== "" ? Number(scores[s.id]) : null,
    }));
    onSave(exam.id, records);
    setSaved(true);
  };

  const filledCount = Object.values(scores).filter(v => v !== "").length;
  const avgScore = filledCount > 0 ? Math.round(Object.entries(scores).filter(([, v]) => v !== "").reduce((a, [, v]) => a + (Number(v) / exam.total) * 100, 0) / filledCount) : 0;
  const ts = TYPE_STYLE[exam.type];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.05)" }}>
      {/* Exam header */}
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-slate-50/50 transition-colors">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ts.dot}`} />
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-800 text-sm">{exam.name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ts.pill}`}>{exam.type}</span>
            <span className="text-[10px] text-slate-400">/ {exam.total} درجة</span>
          </div>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {filledCount > 0 && <span className="text-[11px] font-bold text-amber-700">{avgScore}% متوسط</span>}
          <span className="text-[11px] text-slate-400">{filledCount}/{students.length}</span>
          {saved && filledCount > 0 && <CheckCircle2 size={14} className="text-emerald-500" />}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-slate-100">
          {/* Student score rows */}
          <div className="divide-y divide-slate-50">
            {students.map((s, i) => {
              const val = scores[s.id] ?? "";
              const num = val !== "" ? Number(val) : null;
              const p = num != null ? pct(num, exam.total) : null;
              const initials = s.name.split(" ").slice(0, 2).map(w => w[0]).join("");
              const isOver = num != null && num > exam.total;

              return (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-black text-white">{initials}</span>
                  </div>
                  <p className="flex-1 text-sm font-semibold text-slate-700 min-w-0 truncate">{s.name}</p>

                  {/* Score input */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p != null && (
                      <div className="text-left">
                        <span className={`text-xs font-black ${gradeColor(p)}`}>{p}%</span>
                        <p className={`text-[10px] font-bold ${gradeColor(p)}`}>{gradeLabel(p)}</p>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="number" min="0" max={exam.total}
                        value={val}
                        onChange={e => update(s.id, e.target.value)}
                        placeholder="—"
                        className={`w-16 px-2 py-1.5 text-sm font-bold text-center rounded-xl border transition-all
                          ${isOver ? "border-red-400 bg-red-50 text-red-600" :
                            p != null && p >= 80 ? "border-emerald-200 bg-emerald-50 text-emerald-800" :
                              p != null ? "border-amber-200 bg-amber-50 text-amber-800" :
                                "border-slate-200 bg-slate-50 text-slate-700"}
                          focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                        dir="ltr"
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">/{exam.total}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score distribution bar */}
          {filledCount > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40">
              <p className="text-[10px] font-bold text-slate-400 mb-2">توزيع الدرجات</p>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
                {students.map(s => {
                  const v = scores[s.id] ?? ""; const n = v !== "" ? Number(v) : null;
                  const p = n != null ? pct(n, exam.total) : 0;
                  return <div key={s.id} className={`flex-1 ${n != null ? barColor(p) : "bg-slate-200"} transition-all duration-700`} />;
                })}
              </div>
            </div>
          )}

          {/* Save & Delete */}
          <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
            <button onClick={save}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
                ${saved ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200 hover:from-orange-600 hover:to-amber-600"}`}>
              {saved ? <><CheckCircle2 size={14} /> محفوظ</> : <><Save size={14} /> حفظ الدرجات</>}
            </button>
            <button onClick={() => onDelete(exam.id)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Class Section ─────────────────────────────────────────────────────────────
function ClassSection({ cls, onChange }: { cls: ClassGroup; onChange: (c: ClassGroup) => void }) {
  const [open, setOpen] = useState(true); const [modal, setModal] = useState(false);

  const addExam = (e: Omit<Exam, "id" | "records">) => {
    const exam: Exam = { ...e, id: Date.now(), records: cls.students.map((s, i) => ({ id: Date.now() + i, studentId: s.id, score: null })) };
    onChange({ ...cls, exams: [...cls.exams, exam] });
  };
  const saveExam = (eid: number, records: ExamRecord[]) => {
    onChange({ ...cls, exams: cls.exams.map(e => e.id === eid ? { ...e, records } : e) });
  };
  const delExam = (eid: number) => {
    onChange({ ...cls, exams: cls.exams.filter(e => e.id !== eid) });
  };

  const allScores = cls.exams.flatMap(e => e.records.filter(r => r.score != null).map(r => pct(r.score!, e.total)));
  const classAvg = allScores.length > 0 ? Math.round(allScores.reduce((a, v) => a + v, 0) / allScores.length) : null;

  return (
    <>
      {modal && <AddExamModal onAdd={addExam} onClose={() => setModal(false)} />}
      <div className="fu space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-right min-w-0">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-orange-500 to-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-black text-slate-800 text-sm">{cls.name}</p>
                {classAvg != null && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1
                    ${classAvg >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    <Star size={9} /> متوسط {classAvg}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{cls.students.length} طالب · {cls.exams.length} اختبارات</p>
            </div>
            <ChevronDown size={15} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm shadow-orange-200 flex-shrink-0">
            <Plus size={13} /> اختبار جديد
          </button>
        </div>

        {open && (
          <div className="space-y-2 pr-4">
            {cls.exams.length === 0
              ? <div className="bg-white rounded-2xl border border-slate-100 px-5 py-8 text-center">
                <BookOpen size={28} className="text-slate-300 mx-auto mb-2" strokeWidth={1.2} />
                <p className="text-slate-400 text-sm">لم تُضف اختبارات بعد</p>
                <button onClick={() => setModal(true)} className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700">+ إضافة أول اختبار</button>
              </div>
              : cls.exams.map(exam => (
                <ExamTable key={exam.id} exam={exam} students={cls.students} onSave={saveExam} onDelete={delExam} />
              ))
            }
          </div>
        )}
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TeacherGrades() {
  const [classes, setClasses] = useState<ClassGroup[]>(INITIAL);
  const update = (updated: ClassGroup) => setClasses(p => p.map(c => c.id === updated.id ? updated : c));

  const totalExams = classes.reduce((s, c) => s + c.exams.length, 0);
  const totalStudents = classes.reduce((s, c) => s + c.students.length, 0);
  const allScores = classes.flatMap(c => c.exams.flatMap(e => e.records.filter(r => r.score != null).map(r => pct(r.score!, e.total))));
  const overallAvg = allScores.length > 0 ? Math.round(allScores.reduce((a, v) => a + v, 0) / allScores.length) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-10" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fu .4s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#c2410c 0%,#ea580c 45%,#f97316 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative px-5 pt-7 pb-6">
          <p className="text-orange-200 text-xs font-semibold mb-1 flex items-center gap-1.5"><BookOpen size={12} /> الدرجات</p>
          <h1 className="text-2xl font-black text-white leading-none mb-4">إدارة الدرجات</h1>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "الاختبارات", value: String(totalExams), icon: BookOpen, sub: "اختبار مُسجَّل" },
              { label: "الطلاب", value: String(totalStudents), icon: GraduationCap, sub: "في كل الصفوف" },
              { label: "المتوسط العام", value: overallAvg > 0 ? `${overallAvg}%` : "—", icon: TrendingUp, sub: "لجميع الاختبارات" },
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

      {/* Type guide */}
      <div className="px-4 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-bold text-slate-500">أنواع التقييم:</span>
          {(["امتحان شامل", "كويز", "واجب"] as ExamType[]).map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${TYPE_STYLE[t].dot}`} />
              <span className="text-[11px] font-semibold text-slate-600">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div className="px-4 pt-5 space-y-6">
        {classes.map(cls => <ClassSection key={cls.id} cls={cls} onChange={update} />)}
      </div>
    </div>
  );
}