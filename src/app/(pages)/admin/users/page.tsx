"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ColDef, ICellRendererParams, CellStyle } from "ag-grid-community";
import {
  Trash2, Lock, Unlock, MessageSquare,
  Users, GraduationCap, BookOpen, UserCheck,
} from "lucide-react";
import { DataTable } from "@/components/system";
import { ApiResponse } from "@/interfaces";
import { Assistant } from "@/interfaces/assistant";
import { Parent } from "@/interfaces/parent";
import { Student } from "@/interfaces/student";
import { Teacher } from "@/interfaces/teacher";
import { assistantApi } from "@/services/assistantApi";
import { parentApi } from "@/services/parentApi";
import { studentApi } from "@/services/studentApi";
import { teacherApi } from "@/services/teacherApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseUser {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isLocked: boolean;
}

export type UserType = "assistants" | "teachers" | "students" | "parents";
export type AnyUser = Assistant | Teacher | Student | Parent;

// ─── Tab Config ────────────────────────────────────────────────────────────────

const TABS = [
  {
    key: "assistants" as UserType,
    labelAr: "المساعدين",
    Icon: UserCheck,
    accent: "text-violet-600",
    activeBg: "bg-violet-50",
    activeBorder: "border-violet-400",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-600",
  },
  {
    key: "teachers" as UserType,
    labelAr: "المعلمين",
    Icon: BookOpen,
    accent: "text-blue-600",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-400",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
  },
  {
    key: "students" as UserType,
    labelAr: "الطلبة",
    Icon: GraduationCap,
    accent: "text-emerald-600",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-400",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-600",
  },
  {
    key: "parents" as UserType,
    labelAr: "أولياء الأمور",
    Icon: Users,
    accent: "text-amber-600",
    activeBg: "bg-amber-50",
    activeBorder: "border-amber-400",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-600",
  },
] as const;

// ─── Actions Cell ─────────────────────────────────────────────────────────────

interface ActionsCellProps extends ICellRendererParams {
  onDelete: (id: string | number) => void;
  onToggleLock: (id: string | number, isLocked: boolean) => void;
  onMessage: (id: string | number) => void;
}

function ActionsCell({ data, onDelete, onToggleLock, onMessage }: ActionsCellProps) {
  if (!data) return null;
  const u = data as BaseUser;
  return (
    <div className="flex items-center gap-0.5 h-full">
      <button
        onClick={() => onMessage(u.id)}
        title="إرسال رسالة"
        className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
      >
        <MessageSquare size={14} />
      </button>
      <button
        onClick={() => onToggleLock(u.id, u.isLocked)}
        title={u.isLocked ? "فتح الحساب" : "قفل الحساب"}
        className={`p-2 rounded-lg transition-colors ${u.isLocked
            ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
            : "text-slate-400 hover:text-amber-500 hover:bg-amber-50"
          }`}
      >
        {u.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
      </button>
      <button
        onClick={() => onDelete(u.id)}
        title="حذف"
        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Status Cell ──────────────────────────────────────────────────────────────

function StatusCell({ value }: ICellRendererParams) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${value ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
      }`}>
      {value
        ? <><Lock size={9} /> مقفول</>
        : <><Unlock size={9} /> نشط</>
      }
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<UserType>("assistants");
  const [rowData, setRowData] = useState<AnyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Handlers ────────────────────────────────────────────────

  const handleDelete = useCallback((id: string | number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    setRowData(prev => prev.filter(u => (u as BaseUser).id !== id));
  }, []);

  const handleToggleLock = useCallback((id: string | number, isLocked: boolean) => {
    setRowData(prev =>
      prev.map(u => (u as BaseUser).id === id ? { ...u, isLocked: !isLocked } : u)
    );
  }, []);

  const handleMessage = useCallback((_id: string | number) => {
    // افتح modal الرسالة هنا
  }, []);

  // ── Column Definitions ────────────────────────────────────────────────────

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      // ✅ ترقيم تسلسلي 1، 2، 3... بدل ID من الداتا بيز
      headerName: "#",
      width: 60,
      filter: false,
      sortable: false,
      valueGetter: params => (params.node?.rowIndex ?? 0) + 1,
      cellStyle: { color: "#94a3b8", fontSize: "12px", fontWeight: "600" } as CellStyle,
    },
    {
      headerName: "الاسم الكامل",
      valueGetter: p => p.data ? `${p.data.firstName} ${p.data.lastName}` : "",
      flex: 1,
      minWidth: 160,
      filter: "agTextColumnFilter",
      cellStyle: { fontWeight: "500", color: "#1e293b" } as CellStyle,
    },
    {
      headerName: "البريد الإلكتروني",
      field: "email",
      flex: 1.5,
      minWidth: 200,
      filter: "agTextColumnFilter",
      cellStyle: { color: "#64748b" } as CellStyle,
    },
    {
      headerName: "رقم الهاتف",
      field: "phoneNumber",
      flex: 1,
      minWidth: 140,
      cellStyle: { color: "#64748b", direction: "ltr", textAlign: "right" } as CellStyle,
    },
    {
      headerName: "الحالة",
      field: "isLocked",
      width: 110,
      filter: false,
      sortable: false,
      cellRenderer: StatusCell,
    },
    {
      headerName: "الإجراءات",
      field: "id",
      width: 130,
      sortable: false,
      filter: false,
      pinned: "left",
      cellRenderer: ActionsCell,
      cellRendererParams: {
        onDelete: handleDelete,
        onToggleLock: handleToggleLock,
        onMessage: handleMessage,
      },
    },
  ], [handleDelete, handleToggleLock, handleMessage]);

  // ── Fetch Data ────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (tab: UserType) => {
    setLoading(true);
    setError(null);
    try {
      let result: ApiResponse<AnyUser[]>;
      if (tab === "assistants") result = await assistantApi.getAllAssistants() as ApiResponse<AnyUser[]>;
      else if (tab === "teachers") result = await teacherApi.getAllTeachers() as ApiResponse<AnyUser[]>;
      else if (tab === "students") result = await studentApi.getAllStudents() as ApiResponse<AnyUser[]>;
      else result = await parentApi.getAllParent() as ApiResponse<AnyUser[]>;

      if (!result.isSucceeded) throw new Error(result.message ?? "فشل في جلب البيانات");
      setRowData(result.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير معروف");
      setRowData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(activeTab); }, [activeTab, fetchData]);

  const activeCfg = TABS.find(t => t.key === activeTab)!;

  return (
    <div
      className="p-6 min-h-screen bg-slate-50"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          إدارة المستخدمين
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          عرض وإدارة جميع مستخدمي النظام
        </p>
      </div>

      {/* ── Tab Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {TABS.map(tab => {
          const { Icon } = tab;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-right
                          transition-all duration-200 group ${isActive
                  ? `${tab.activeBg} ${tab.activeBorder} shadow-sm`
                  : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? "bg-white/70" : "bg-slate-100 group-hover:bg-slate-200"
                } transition-colors`}>
                <Icon size={18} className={isActive ? tab.accent : "text-slate-500"} />
              </div>
              <span className={`font-semibold text-sm ${isActive ? tab.accent : "text-slate-600"
                }`}>
                {tab.labelAr}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── DataTable ───────────────────────────────────────── */}
      <DataTable
        rowData={rowData}
        columnDefs={columnDefs}
        title={activeCfg.labelAr}
        TitleIcon={activeCfg.Icon}
        accentColor={activeCfg.accent}
        badgeBg={activeCfg.badgeBg}
        badgeText={activeCfg.badgeText}
        loading={loading}
        error={error}
        showRefresh
        onRefresh={() => fetchData(activeTab)}
        showExport
        pageSize={10}
        height={520}
      />
    </div>
  );
}