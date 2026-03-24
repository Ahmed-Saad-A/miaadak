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
        { id: 1, title: "مراجعة الجبر", date: "2025-01-19", time: "10:00", students: 8, maxStudents: 12, type: "Online" },
        { id: 2, title: "الهندسة الفراغية", date: "2025-01-19", time: "15:00", students: 10, maxStudents: 10, type: "Offline" },
        { id: 3, title: "التفاضل والتكامل", date: "2025-01-20", time: "11:00", students: 6, maxStudents: 15, type: "Online" }
    ]);

    const [recentBookings] = useState([
        { id: 1, student: "محمد علي", session: "مراجعة الجبر", date: "2025-01-18", status: "Confirmed" },
        { id: 2, student: "فاطمة أحمد", session: "الهندسة الفراغية", date: "2025-01-18", status: "Pending" },
        { id: 3, student: "عمر خالد", session: "التفاضل والتكامل", date: "2025-01-17", status: "Confirmed" }
    ]);

    return (
        <div className="min-h-screen bg-[#f4f4f4] p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <img src={teacher.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-indigo-100" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">مرحباً، {teacher.name}</h1>
                                <p className="text-gray-600 mt-1">معلم {teacher.subject} • {teacher.experienceYears} سنوات خبرة</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-gray-800">{teacher.rating}</span>
                                        <span className="text-gray-500 text-sm">({teacher.totalRatings} تقييم)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-600">{teacher.strengthPercentage}%</span>
                                        <span className="text-gray-500 text-sm">قوة الأداء</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-md">
                            <Plus className="w-5 h-5" />
                            إنشاء حصة جديدة
                        </button>
                    </div>
                </div>

                {/* Subscription Alert */}
                {subscription.isActive ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-gray-800">{subscription.packageName} نشط</p>
                                <p className="text-sm text-gray-600">استخدمت {subscription.sessionsUsed} من {subscription.maxSessions} حصة • متبقي {subscription.daysRemaining} يوم</p>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600">ينتهي في {subscription.endDate}</span>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <div>
                                <p className="font-semibold text-gray-800">لا يوجد اشتراك نشط</p>
                                <p className="text-sm text-gray-600">قم بتجديد اشتراكك لمواصلة إنشاء الحصص</p>
                            </div>
                        </div>
                        <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition text-sm">
                            تجديد الآن
                        </button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">إجمالي الحصص</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalSessions}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">الحصص القادمة</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.upcomingSessions}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">الطلاب النشطون</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.activeStudents}</p>
                                <p className="text-xs text-gray-500 mt-1">من أصل {stats.totalStudents}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">الحجوزات المعلقة</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingBookings}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">الحصص القادمة</h2>
                            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">عرض الكل</button>
                        </div>
                        <div className="space-y-4">
                            {upcomingSessions.map(session => (
                                <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{session.title}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {session.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {session.time}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs ${session.type === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {session.type === 'Online' ? 'أونلاين' : 'حضوري'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className={`flex items-center gap-1 ${session.students >= session.maxStudents ? 'text-red-600' : 'text-green-600'}`}>
                                                <Users className="w-4 h-4" />
                                                <span className="font-semibold">{session.students}/{session.maxStudents}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">طالب</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">الحجوزات الأخيرة</h2>
                        </div>
                        <div className="space-y-3">
                            {recentBookings.map(booking => (
                                <div key={booking.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{booking.student}</p>
                                            <p className="text-xs text-gray-600 mt-1">{booking.session}</p>
                                            <p className="text-xs text-gray-500 mt-1">{booking.date}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {booking.status === 'Confirmed' ? 'مؤكد' : 'معلق'}
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