"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
    Plus, Pencil, Trash2, Check, X,
    Search, AlertTriangle, RefreshCw,
    BookOpen,
} from "lucide-react";
import { Subject } from "@/interfaces/teacher";
import { studentApi } from "@/services/studentApi";

type FormMode = "idle" | "add" | "edit" | "delete";

function Spinner() {
    return (
        <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin inline-block" />
    );
}

function arabicError(e: unknown): string {
    if (e instanceof Error) {
        const msg = e.message.toLowerCase();
        if (msg.includes("fetch") || msg.includes("network")) return "تعذّر الاتصال بالخادم، تحقق من الإنترنت";
        if (msg.includes("404")) return "العنصر غير موجود";
        if (msg.includes("401") || msg.includes("403")) return "غير مصرح بهذه العملية";
        if (msg.includes("500")) return "خطأ في الخادم، حاول لاحقاً";
        if (msg.includes("create")) return "فشلت عملية الإضافة";
        if (msg.includes("update")) return "فشلت عملية التعديل";
        if (msg.includes("delete")) return "فشلت عملية الحذف";
    }
    return "حدث خطأ غير متوقع، حاول مرة أخرى";
}

export default function Page() {

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filtered, setFiltered] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<FormMode>("idle");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [nameInput, setNameInput] = useState("");
    const [search, setSearch] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [apiError, setApiError] = useState("");
    const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedSubject = useMemo(
        () => (selectedId ? subjects.find(s => s.id === selectedId) ?? null : null),
        [subjects, selectedId]
    );

    // ── Toast ─────────────────────────────────────────────────────────────────
    const showToast = (msg: string, type: "ok" | "err" = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── getAllSubjects ─────────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true); setApiError("");
        try {
            const res = await studentApi.getAllSubjects();
            if (!res.isSucceeded) throw new Error(res.message ?? "");
            setSubjects(res.data ?? []);
        } catch (e) {
            setApiError(arabicError(e));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    useEffect(() => {
        if (!search.trim()) { setFiltered(subjects); return; }
        setFiltered(subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase())));
    }, [search, subjects]);

    useEffect(() => {
        if (mode === "add" || mode === "edit") setTimeout(() => inputRef.current?.focus(), 60);
    }, [mode]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const cancel = () => {
        setMode("idle"); setSelectedId(null);
        setNameInput(""); setFieldError(""); setApiError("");
    };

    const openAdd = () => {
        setSelectedId(null); setNameInput(""); setMode("add");
        setFieldError(""); setApiError("");
    };

    const openEdit = (subject: Subject) => {
        setSelectedId(subject.id); setNameInput(subject.name); setMode("edit");
        setFieldError(""); setApiError("");
    };

    const openDelete = (subject: Subject) => {
        setSelectedId(subject.id); setMode("delete");
        setFieldError(""); setApiError("");
    };

    // ── createSubject — body: { name } ────────────────────────────────────────
    const handleCreate = async () => {
        const name = nameInput.trim();
        if (!name) { setFieldError("اسم المادة مطلوب"); return; }
        setSaving(true); setFieldError(""); setApiError("");
        try {
            const res = await studentApi.createSubject(name);
            if (!res.isSucceeded) throw new Error(res.message ?? "");
            setSubjects(prev => [...prev, res.data]);
            showToast("تم إضافة المادة بنجاح");
            cancel();
        } catch (e) { setApiError(arabicError(e)); }
        finally { setSaving(false); }
    };

    // ── updateSubject — body: { id, name } ───────────────────────────────────
    const handleUpdate = async () => {
        if (selectedId === null) return;
        const name = nameInput.trim();
        if (!name) { setFieldError("اسم المادة مطلوب"); return; }
        setSaving(true); setFieldError(""); setApiError("");
        try {
            const res = await studentApi.updateSubject(selectedId, name);
            if (!res.isSucceeded) throw new Error(res.message ?? "");
            setSubjects(prev => prev.map(s => s.id === selectedId ? res.data : s));
            showToast("تم تعديل المادة بنجاح");
            cancel();
        } catch (e) { setApiError(arabicError(e)); }
        finally { setSaving(false); }
    };

    // ── deleteSubject — query: ?id={id} ──────────────────────────────────────
    const handleDelete = async () => {
        if (selectedId === null) return;
        setSaving(true); setApiError("");
        try {
            const res = await studentApi.deleteSubject(selectedId);
            if (!res.isSucceeded) throw new Error(res.message ?? "");
            setSubjects(prev => prev.filter(s => s.id !== selectedId));
            showToast("تم حذف المادة");
            cancel();
        } catch (e) { setApiError(arabicError(e)); }
        finally { setSaving(false); }
    };

    const handleSave = () => mode === "add" ? handleCreate() : handleUpdate();

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div
            className="min-h-screen bg-slate-50 p-6"
            dir="rtl"
            style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');`}</style>

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl
                                 text-sm font-semibold flex items-center gap-2
                                 ${toast.type === "ok"
                        ? "bg-white text-amber-700 border border-amber-100"
                        : "bg-white text-red-600 border border-red-100"}`}>
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="mb-7 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-200">
                        <BookOpen size={22} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">المواد الدراسية</h1>
                        <p className="text-slate-400 text-xs mt-0.5">إضافة وتعديل وحذف المواد الدراسية</p>
                    </div>
                </div>

                <button
                    onClick={openAdd}
                    disabled={mode === "add"}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600
                               disabled:opacity-50 text-white text-sm font-bold rounded-xl
                               shadow-md shadow-amber-200 transition-all hover:-translate-y-0.5
                               hover:shadow-lg hover:shadow-amber-300 active:translate-y-0"
                >
                    <Plus size={15} strokeWidth={2.5} />
                    إضافة مادة
                </button>
            </div>

            {/* Layout */}
            <div className="flex gap-5 flex-col lg:flex-row items-start">

                {/* ══ Side Panel ══════════════════════════════════════════════ */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-4">

                    {/* Add / Edit Form */}
                    {(mode === "add" || mode === "edit") && (
                        <div className="bg-white rounded-2xl p-5 border border-amber-100"
                            style={{ boxShadow: "0 0 0 1px #fef3c7, 0 4px 20px rgba(245,158,11,0.08)" }}>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                                    {mode === "add"
                                        ? <Plus size={14} className="text-amber-600" />
                                        : <Pencil size={14} className="text-amber-600" />}
                                </div>
                                <p className="text-sm font-bold text-slate-700">
                                    {mode === "add" ? "مادة جديدة" : `تعديل: ${selectedSubject?.name ?? ""}`}
                                </p>
                            </div>

                            <div className="mb-3">
                                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                                    اسم المادة <span className="text-red-400">*</span>
                                </label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={nameInput}
                                    onChange={e => { setNameInput(e.target.value); setFieldError(""); }}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") handleSave();
                                        if (e.key === "Escape") cancel();
                                    }}
                                    placeholder="مثال: الرياضيات"
                                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all
                                                text-slate-700 placeholder:text-slate-300
                                                ${fieldError
                                            ? "border-red-300 bg-red-50 ring-2 ring-red-100"
                                            : "border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:bg-white"
                                        }`}
                                />
                                {fieldError && (
                                    <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
                                        <AlertTriangle size={11} /> {fieldError}
                                    </p>
                                )}
                            </div>

                            {apiError && (
                                <p className="mb-3 text-red-500 text-xs flex items-center gap-1 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                                    <AlertTriangle size={11} className="flex-shrink-0" /> {apiError}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                                               bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold
                                               transition-all disabled:opacity-60"
                                >
                                    {saving ? <Spinner /> : <Check size={14} strokeWidth={2.5} />}
                                    {mode === "add" ? "إضافة" : "حفظ التعديل"}
                                </button>
                                <button
                                    onClick={cancel}
                                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirm */}
                    {mode === "delete" && selectedSubject && (
                        <div className="bg-white rounded-2xl p-5 border border-red-100"
                            style={{ boxShadow: "0 0 0 1px #fecaca, 0 4px 20px rgba(239,68,68,0.08)" }}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                                    <Trash2 size={14} className="text-red-500" />
                                </div>
                                <p className="text-sm font-bold text-slate-700">تأكيد الحذف</p>
                            </div>

                            <p className="text-xs text-slate-500 leading-5 mb-4">
                                سيتم حذف مادة{" "}
                                <span className="font-bold text-slate-700">
                                    {`"${selectedSubject?.name ?? ""}"`}
                                </span>{" "}
                                بشكل نهائي ولا يمكن التراجع عنه.
                            </p>

                            {apiError && (
                                <p className="mb-3 text-red-500 text-xs flex items-center gap-1 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                                    <AlertTriangle size={11} className="flex-shrink-0" /> {apiError}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                                               bg-red-500 hover:bg-red-600 text-white text-xs font-bold
                                               transition-all disabled:opacity-60"
                                >
                                    {saving
                                        ? <span className="w-4 h-4 rounded-full border-2 border-red-200 border-t-white animate-spin inline-block" />
                                        : <Trash2 size={13} />}
                                    حذف نهائياً
                                </button>
                                <button
                                    onClick={cancel}
                                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Idle hint */}
                    {mode === "idle" && (
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
                            <BookOpen size={28} className="text-slate-200 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">
                                اختر مادة للتعديل أو الحذف،<br />أو أضف مادة جديدة
                            </p>
                        </div>
                    )}

                    {/* Count */}
                    <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">إجمالي المواد</span>
                        <span className="text-xl font-bold text-amber-600">{subjects.length}</span>
                    </div>
                </div>

                {/* ══ Main List ══════════════════════════════════════════════ */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                        style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.07), 0 0 0 1px rgba(15,23,42,0.05)" }}>

                        {/* List Header */}
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} className="text-amber-500" />
                                <h2 className="font-bold text-slate-700 text-sm">قائمة المواد</h2>
                                {!loading && (
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600">
                                        {filtered.length}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="بحث..."
                                        className="pr-8 pl-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50
                                                   focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400
                                                   w-36 placeholder:text-slate-300 text-slate-700 transition-all"
                                    />
                                    <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <button
                                    onClick={fetchAll}
                                    disabled={loading}
                                    title="تحديث"
                                    className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all disabled:opacity-40"
                                >
                                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>
                        </div>

                        {/* Error banner */}
                        {apiError && mode === "idle" && (
                            <div className="mx-4 mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs flex items-center gap-2">
                                <AlertTriangle size={12} className="flex-shrink-0" /> {apiError}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-amber-100 border-t-amber-500 animate-spin" />
                                    <p className="text-slate-400 text-xs">جاري تحميل المواد...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-300">
                                    <BookOpen size={40} strokeWidth={1} />
                                    <p className="text-sm font-medium">
                                        {search ? `لا نتائج لـ "${search}"` : "لا توجد مواد بعد"}
                                    </p>
                                    {!search && (
                                        <button
                                            onClick={openAdd}
                                            className="text-xs text-amber-500 hover:text-amber-600 font-bold mt-1 underline underline-offset-2"
                                        >
                                            + أضف أول مادة الآن
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                    {filtered?.map((subject, idx) => {
                                        const isEditing = selectedId === subject?.id && mode === "edit";
                                        const isDeleting = selectedId === subject?.id && mode === "delete";

                                        return (
                                            <div
                                                key={subject?.id}
                                                className={`group flex items-center justify-between gap-2 px-4 py-3.5
                                                            rounded-xl border transition-all duration-150
                                                            ${isEditing
                                                        ? "border-amber-300 bg-amber-50 shadow-sm"
                                                        : isDeleting
                                                            ? "border-red-200 bg-red-50"
                                                            : "border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className={`w-6 h-6 rounded-md text-xs font-bold
                                                                      flex items-center justify-center flex-shrink-0 transition-colors
                                                                      ${isEditing
                                                            ? "bg-amber-200 text-amber-700"
                                                            : isDeleting
                                                                ? "bg-red-100 text-red-500"
                                                                : "bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600"
                                                        }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-700 truncate">
                                                            {subject?.name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">رقم: {subject?.id}</p>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center gap-1 flex-shrink-0 transition-opacity
                                                                 ${isEditing || isDeleting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                                    <button
                                                        onClick={() => isEditing ? cancel() : openEdit(subject)}
                                                        title="تعديل"
                                                        className={`p-1.5 rounded-lg transition-colors
                                                                    ${isEditing
                                                                ? "bg-amber-200 text-amber-700"
                                                                : "text-slate-400 hover:text-amber-600 hover:bg-amber-100"
                                                            }`}
                                                    >
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => isDeleting ? cancel() : openDelete(subject)}
                                                        title="حذف"
                                                        className={`p-1.5 rounded-lg transition-colors
                                                                    ${isDeleting
                                                                ? "bg-red-100 text-red-500"
                                                                : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                            }`}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}