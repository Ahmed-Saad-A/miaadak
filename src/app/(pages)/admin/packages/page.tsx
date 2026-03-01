"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package, Pencil, RefreshCw, AlertTriangle,
  Check, X, CalendarDays, Users, UserCheck,
  DollarSign, BookOpen, Boxes, Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { teacherApi } from "@/services/teacherApi";
import { Package as PackageType } from "@/interfaces";

// ─── Arabic error ─────────────────────────────────────────────────────────────
function arabicError(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message.toLowerCase();
    if (m.includes("network") || m.includes("fetch")) return "تعذّر الاتصال بالخادم";
    if (m.includes("404")) return "الباقة غير موجودة";
    if (m.includes("401") || m.includes("403")) return "غير مصرح بهذه العملية";
    if (m.includes("500")) return "خطأ في الخادم، حاول لاحقاً";
  }
  return "حدث خطأ غير متوقع، حاول مرة أخرى";
}

// ─── Types ────────────────────────────────────────────────────────────────────
type FieldKey =
  | "name" | "monthlyPrice" | "description"
  | "maxSessionsPerMonth" | "maxStudentsPerSession" | "maxAssistantsPerTeacher";

type FormState = Partial<Record<FieldKey, string>>;

interface FieldMeta {
  key: FieldKey;
  label: string;
  icon: React.ElementType;
  type: "text" | "number" | "textarea";
  placeholder: string;
  unit?: string;
}

const FIELDS: FieldMeta[] = [
  { key: "name", label: "اسم الباقة", icon: Boxes, type: "text", placeholder: "مثال: الباقة الذهبية" },
  { key: "monthlyPrice", label: "السعر الشهري", icon: DollarSign, type: "number", placeholder: "0", unit: "ج.م / شهر" },
  { key: "description", label: "الوصف", icon: BookOpen, type: "textarea", placeholder: "وصف مختصر للباقة..." },
  { key: "maxSessionsPerMonth", label: "الجلسات شهرياً", icon: CalendarDays, type: "number", placeholder: "0", unit: "جلسة" },
  { key: "maxStudentsPerSession", label: "طلاب في الجلسة", icon: Users, type: "number", placeholder: "0", unit: "طالب" },
  { key: "maxAssistantsPerTeacher", label: "مساعدين للمعلم", icon: UserCheck, type: "number", placeholder: "0", unit: "مساعد" },
];

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({
  pkg, onEdit, index,
}: { pkg: PackageType; onEdit: (p: PackageType) => void; index: number }) {

  const highlights = [
    { icon: CalendarDays, label: "جلسة / شهر", value: pkg.maxSessionsPerMonth },
    { icon: Users, label: "طالب / جلسة", value: pkg.maxStudentsPerSession },
    { icon: UserCheck, label: "مساعد", value: pkg.maxAssistantsPerTeacher },
  ];

  // دوّري بين درجات amber للكروت
  const accents = [
    { ring: "#f59e0b", bar: "from-amber-400 to-amber-500", badge: "bg-amber-50 text-amber-600 border-amber-100" },
    { ring: "#d97706", bar: "from-amber-500 to-amber-600", badge: "bg-orange-50 text-orange-600 border-orange-100" },
    { ring: "#b45309", bar: "from-amber-600 to-amber-700", badge: "bg-amber-100 text-amber-700 border-amber-200" },
  ];
  const accent = accents[index % accents.length];

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden
                 transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 8px 32px rgba(15,23,42,0.10), 0 0 0 1.5px ${accent.ring}40`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 4px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)";
      }}
    >
      {/* Top color bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent.bar}`} />

      <div className="p-6 flex flex-col flex-1">

        {/* Header row: name + price */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Package size={15} className="text-amber-500 flex-shrink-0" />
              <h3 className="font-black text-slate-800 text-base leading-tight truncate">
                {pkg.name}
              </h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 pr-5">
              {pkg.description || "لا يوجد وصف"}
            </p>
          </div>

          {/* Price pill */}
          <div className="flex-shrink-0 text-center">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-black ${accent.badge} whitespace-nowrap`}>
              {pkg.monthlyPrice?.toLocaleString("ar-EG")} ج.م
            </div>
            <p className="text-slate-400 text-[10px] mt-1 text-center">شهرياً</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-4" />

        {/* Stats: 3 boxes */}
        <div className="grid grid-cols-3 gap-2 mb-5 flex-1">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-slate-50 rounded-xl p-3 text-center group-hover:bg-amber-50/50 transition-colors"
            >
              <Icon size={16} className="text-amber-400 mx-auto mb-1.5" strokeWidth={1.8} />
              <p className="text-base font-black text-slate-700 leading-none">{value}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Edit button */}
        <button
          onClick={() => onEdit(pkg)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                     bg-slate-100 text-slate-600 text-xs font-bold
                     hover:bg-amber-500 hover:text-white hover:shadow-md hover:shadow-amber-200
                     transition-all duration-200 group/btn"
        >
          <Pencil size={13} className="group-hover/btn:rotate-12 transition-transform duration-200" />
          تعديل الباقة
        </button>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin inline-block" />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Packages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageType | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── getAllPackages ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const res = await teacherApi.getAllPackages();
      if (!res.isSucceeded) throw new Error(res.message ?? "");
      setPackages(res.data ?? []);
    } catch (e) {
      setApiError(arabicError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Open Dialog ────────────────────────────────────────────────────────────
  const openEdit = (pkg: PackageType) => {
    setEditingPkg(pkg);
    setForm({
      name: String(pkg.name),
      monthlyPrice: String(pkg.monthlyPrice),
      description: pkg.description ?? "",
      maxSessionsPerMonth: String(pkg.maxSessionsPerMonth),
      maxStudentsPerSession: String(pkg.maxStudentsPerSession),
      maxAssistantsPerTeacher: String(pkg.maxAssistantsPerTeacher),
    });
    setFieldErrors({});
    setApiError("");
  };

  const closeEdit = () => {
    if (saving) return;
    setEditingPkg(null);
    setForm({});
    setFieldErrors({});
    setApiError("");
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<Record<FieldKey, string>> = {};
    if (!form.name?.trim()) errs.name = "مطلوب";
    if (!form.monthlyPrice) errs.monthlyPrice = "مطلوب";
    if (Number(form.monthlyPrice) < 0) errs.monthlyPrice = "يجب أن يكون موجباً";
    if (!form.description?.trim()) errs.description = "مطلوب";
    if (!form.maxSessionsPerMonth) errs.maxSessionsPerMonth = "مطلوب";
    if (!form.maxStudentsPerSession) errs.maxStudentsPerSession = "مطلوب";
    if (!form.maxAssistantsPerTeacher) errs.maxAssistantsPerTeacher = "مطلوب";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── updatePackage ──────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!editingPkg || !validate()) return;
    setSaving(true); setApiError("");
    try {
      const res = await teacherApi.updatePackage(
        editingPkg.id,
        Number(form.name),
        Number(form.monthlyPrice),
        form.description!.trim(),
        Number(form.maxSessionsPerMonth),
        Number(form.maxStudentsPerSession),
        Number(form.maxAssistantsPerTeacher),
      );
      if (!res.isSucceeded) throw new Error(res.message ?? "");
      setPackages(prev => prev.map(p => p.id === editingPkg.id ? res.data : p));
      showToast("تم تحديث الباقة بنجاح ✓");
      closeEdit();
    } catch (e) {
      setApiError(arabicError(e));
    } finally {
      setSaving(false);
    }
  };

  const setField = (key: FieldKey, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setFieldErrors(fe => ({ ...fe, [key]: undefined }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-slate-50 p-6"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl
                         text-sm font-semibold flex items-center gap-2 pointer-events-none
                         ${toast.type === "ok"
            ? "bg-white text-amber-700 border border-amber-100"
            : "bg-white text-red-600 border border-red-100"}`}>
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600
                          flex items-center justify-center shadow-lg shadow-amber-200">
            <Package size={24} className="text-white" strokeWidth={2} />
            <Sparkles size={10} className="text-yellow-200 absolute top-1.5 right-1.5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">إدارة الباقات</h1>
            <p className="text-slate-400 text-xs mt-0.5">عرض وتعديل الباقات المتاحة للمعلمين</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!loading && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
              {packages.length} باقات
            </span>
          )}
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200
                       text-slate-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50
                       text-xs font-semibold transition-all disabled:opacity-40 shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            تحديث
          </button>
        </div>
      </div>

      {/* Global error */}
      {apiError && !editingPkg && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs flex items-center gap-2">
          <AlertTriangle size={13} className="flex-shrink-0" /> {apiError}
        </div>
      )}

      {/* ── Cards ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-100 border-t-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm">جاري تحميل الباقات...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-300">
          <Package size={48} strokeWidth={1} />
          <p className="text-sm font-medium">لا توجد باقات متاحة</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {packages?.map((pkg, idx) => (
            <PackageCard key={pkg.id} pkg={pkg} onEdit={openEdit} index={idx} />
          ))}
        </div>
      )}

      {/* ══ Edit Dialog ════════════════════════════════════════════════════════ */}
      <Dialog open={!!editingPkg} onOpenChange={open => !open && closeEdit()}>
        <DialogContent
          className="max-w-lg w-full"
          dir="rtl"
          style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
        >
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="flex items-center gap-2 text-base font-black text-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Pencil size={15} className="text-amber-600" />
              </div>
              تعديل: {editingPkg?.name}
            </DialogTitle>
          </DialogHeader>

          {/* Form body */}
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-1">
            {FIELDS.map(({ key, label, icon: Icon, type, placeholder, unit }) => {
              const err = fieldErrors[key];
              const cls = `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all
                           text-slate-700 placeholder:text-slate-300
                           ${err
                  ? "border-red-300 bg-red-50 ring-2 ring-red-100"
                  : "border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white"
                }`;
              return (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Icon size={12} className="text-amber-500" />
                    {label}
                    {unit && <span className="text-slate-400 font-normal text-[10px]">({unit})</span>}
                    <span className="text-red-400 mr-0.5">*</span>
                  </label>

                  {type === "textarea" ? (
                    <textarea
                      value={form[key] ?? ""}
                      onChange={e => setField(key, e.target.value)}
                      placeholder={placeholder}
                      rows={3}
                      className={cls + " resize-none"}
                    />
                  ) : (
                    <input
                      type={type}
                      value={form[key] ?? ""}
                      onChange={e => setField(key, e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleUpdate(); }}
                      placeholder={placeholder}
                      min={type === "number" ? 0 : undefined}
                      className={cls}
                    />
                  )}

                  {err && (
                    <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                      <AlertTriangle size={10} /> {err}
                    </p>
                  )}
                </div>
              );
            })}

            {/* API error */}
            {apiError && (
              <p className="text-red-500 text-xs flex items-center gap-1.5 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">
                <AlertTriangle size={12} className="flex-shrink-0" /> {apiError}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 gap-2 flex-row-reverse sm:flex-row-reverse">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                         bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold
                         transition-all disabled:opacity-60 shadow-md shadow-amber-200"
            >
              {saving ? <Spinner /> : <Check size={15} strokeWidth={2.5} />}
              حفظ التعديلات
            </button>
            <button
              onClick={closeEdit}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200
                         text-slate-600 text-sm font-semibold transition-all disabled:opacity-60"
            >
              <X size={15} />
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}