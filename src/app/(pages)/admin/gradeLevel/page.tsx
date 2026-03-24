"use client";

import { useState } from "react";
import { LayoutList, BookOpen } from "lucide-react";
import { GradeLevelsSection, SubjectsSection } from '@/components';


// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
    {
        key:   "levels"   as const,
        label: "مستويات الطلبة",
        icon:  LayoutList,
        desc:  "إدارة المستويات الدراسية",
    },
    {
        key:   "subjects" as const,
        label: "المواد الدراسية",
        icon:  BookOpen,
        desc:  "إدارة المواد الدراسية",
    },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabKey>("levels");

    return (
        <div
            className="bg-slate-50 min-h-screen"
            dir="rtl"
            style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');`}</style>


            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="px-6 pt-6 pb-0">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-slate-800">إعدادات الدراسة</h1>
                    <p className="text-slate-400 text-xs mt-0.5">إدارة المستويات والمواد الدراسية</p>
                </div>

                {/* ── Tabs ──────────────────────────────────────────────────── */}
                <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1 w-fit"
                     style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
                    {TABS.map(tab => {
                        const { Icon } = { Icon: tab.icon };
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                                            transition-all duration-200
                                            ${isActive
                                                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                                                : "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                                            }`}
                            >
                                <Icon size={15} strokeWidth={2} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 h-px bg-slate-100" />
            </div>

            <div className="relative">
                <div className={activeTab === "levels" ? "block" : "hidden"}>
                    <GradeLevelsSection />
                </div>
                <div className={activeTab === "subjects" ? "block" : "hidden"}>
                    <SubjectsSection />
                </div>
            </div>
        </div>
    );
}