"use client";

import { Calendar, Users, Star, BookOpen, Clock, TrendingUp, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { useState } from 'react';

export default function TeacherDashboard() {
    const [teacher] = useState({
        name: "أ. أحمد محمد",
        subject: "الرياضيات",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
        experienceYears: 5,
        rating: 4.8,
        totalRatings: 127,
        strengthPercentage: 92
    });

    const [subscription] = useState({
        packageName: "الباقة الذهبية",
        isActive: true,
        endDate: "2025-02-15",
        sessionsUsed: 12,
        maxSessions: 30,
        daysRemaining: 28
    });

    const [stats] = useState({
        totalSessions: 45,
        upcomingSessions: 8,
        totalStudents: 156,
        activeStudents: 89,
        pendingBookings: 5,
        monthlyEarnings: 12500
    });

    const [upcomingSessions] = useState([
        { id: 1, title: "مراجعة الجبر",         date: "2025-01-19", time: "10:00", students: 8,  maxStudents: 12, type: "Online"   },
        { id: 2, title: "الهندسة الفراغية",      date: "2025-01-19", time: "15:00", students: 10, maxStudents: 10, type: "Offline"  },
        { id: 3, title: "التفاضل والتكامل",      date: "2025-01-20", time: "11:00", students: 6,  maxStudents: 15, type: "Online"   },
    ]);

    const [recentBookings] = useState([
        { id: 1, student: "محمد علي",    session: "مراجعة الجبر",    date: "2025-01-18", status: "Confirmed" },
        { id: 2, student: "فاطمة أحمد", session: "الهندسة الفراغية", date: "2025-01-18", status: "Pending"   },
        { id: 3, student: "عمر خالد",   session: "التفاضل والتكامل", date: "2025-01-17", status: "Confirmed" },
    ]);

    return (
        <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <img
                                src={teacher.avatar}
                                alt="avatar"
                                className="w-20 h-20 rounded-full border-4 border-orange-100"
                            />
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">مرحباً، {teacher.name}</h1>
                                <p className="text-slate-500 mt-1 text-sm">
                                    معلم {teacher.subject} • {teacher.experienceYears} سنوات خبرة
                                </p>
                                <div className="flex items-center gap-4 mt-2 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold text-slate-800 text-sm">{teacher.rating}</span>
                                        <span className="text-slate-400 text-xs">({teacher.totalRatings} تقييم)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4 text-orange-500" />
                                        <span className="font-bold text-orange-600 text-sm">{teacher.strengthPercentage}%</span>
                                        <span className="text-slate-400 text-xs">قوة الأداء</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl
                                           transition flex items-center gap-2 shadow-md shadow-orange-200 text-sm font-bold">
                            <Plus className="w-4 h-4" />
                            إنشاء حصة جديدة
                        </button>
                    </div>
                </div>

                {/* ── Subscription Banner ──────────────────────────────────── */}
                {subscription.isActive ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{subscription.packageName} — نشط</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    استخدمت {subscription.sessionsUsed} من {subscription.maxSessions} حصة
                                    &nbsp;•&nbsp; متبقي {subscription.daysRemaining} يوم
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400">ينتهي في {subscription.endDate}</span>
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-slate-800 text-sm">لا يوجد اشتراك نشط</p>
                                <p className="text-xs text-slate-500 mt-0.5">قم بتجديد اشتراكك لمواصلة إنشاء الحصص</p>
                            </div>
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl
                                           text-xs font-bold transition shadow-sm shadow-orange-200">
                            تجديد الآن
                        </button>
                    </div>
                )}

                {/* ── Stats Grid ───────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "إجمالي الحصص",     value: stats.totalSessions,    sub: null,                               icon: BookOpen, bg: "bg-orange-50",  icon_c: "text-orange-500" },
                        { label: "الحصص القادمة",    value: stats.upcomingSessions,  sub: null,                               icon: Clock,    bg: "bg-amber-50",   icon_c: "text-amber-500"  },
                        { label: "الطلاب النشطون",   value: stats.activeStudents,    sub: `من أصل ${stats.totalStudents}`,    icon: Users,    bg: "bg-orange-50",  icon_c: "text-orange-500" },
                        { label: "الحجوزات المعلقة", value: stats.pendingBookings,   sub: null,                               icon: Calendar, bg: "bg-amber-50",   icon_c: "text-amber-500"  },
                    ].map(({ label, value, sub, icon: Icon, bg, icon_c }) => (
                        <div key={label} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md hover:shadow-orange-100 transition">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold">{label}</p>
                                    <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
                                    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
                                </div>
                                <div className={`${bg} p-3 rounded-xl`}>
                                    <Icon className={`w-5 h-5 ${icon_c}`} strokeWidth={1.8} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Main Grid ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-black text-slate-800">الحصص القادمة</h2>
                            <button className="text-orange-500 hover:text-orange-600 text-xs font-bold transition">
                                عرض الكل
                            </button>
                        </div>
                        <div className="space-y-3">
                            {upcomingSessions.map(session => (
                                <div key={session.id}
                                     className="border border-slate-100 rounded-xl p-4 hover:border-orange-200
                                                hover:bg-orange-50/30 transition">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-sm">{session.title}</h3>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />{session.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />{session.time}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold
                                                    ${session.type === "Online"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-slate-100 text-slate-600"}`}>
                                                    {session.type === "Online" ? "أونلاين" : "حضوري"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-left flex-shrink-0">
                                            <div className={`flex items-center gap-1 text-sm font-black
                                                ${session.students >= session.maxStudents
                                                    ? "text-red-500"
                                                    : "text-orange-600"}`}>
                                                <Users className="w-4 h-4" />
                                                {session.students}/{session.maxStudents}
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-0.5">طالب</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                        <h2 className="text-base font-black text-slate-800 mb-5">الحجوزات الأخيرة</h2>
                        <div className="space-y-3">
                            {recentBookings.map(booking => (
                                <div key={booking.id}
                                     className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-800 text-sm truncate">{booking.student}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 truncate">{booking.session}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{booking.date}</p>
                                        </div>
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0
                                            ${booking.status === "Confirmed"
                                                ? "bg-orange-50 text-orange-700 border border-orange-200"
                                                : "bg-amber-50  text-amber-700  border border-amber-200"}`}>
                                            {booking.status === "Confirmed" ? "مؤكد" : "معلق"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}