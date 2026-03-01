export const roleRoutes = {
  
  teacher: [
    { path: "/teacher", label: "لوحة القيادة", iconKey: "Dashboard" },
    { path: "/teacher/schedule", label: "الجدول", iconKey: "Schedule" },
    { path: "/teacher/students", label: "الطلاب", iconKey: "Students" },
    { path: "/teacher/attendance", label: "الغياب", iconKey: "Attendance" },
    { path: "/teacher/assistant", label: "المساعدين", iconKey: "Assistant" },
    { path: "/teacher/grades", label: "الدرجات", iconKey: "Grades" },
    { path: "/teacher/notifications", label: "الإشعارات", iconKey: "Notifications" },
    { path: "/teacher/settings", label: "الإعدادات", iconKey: "Settings" },
    { path: "/teacher/sessions", label: "الحصص", iconKey: "Lessons" },
    { path: "/teacher/exams", label: "الامتحانات", iconKey: "ClipboardList" },
    { path: "/teacher/subscriptions", label: "الاشتراكات", iconKey: "Bookings" },
    { path: "/teacher/ratings", label: "التقييمات", iconKey: "Statistics" },
  ],

  student: [
    { path: "/student", label: "الرئيسية", iconKey: "Dashboard" },
    { path: "/student/lessons", label: "المحاضرات", iconKey: "Lessons" },
    { path: "/student/schedule", label: "جدولي", iconKey: "Schedule" },
    { path: "/student/grades", label: "الدرجات", iconKey: "Grades" },
    { path: "/student/notifications", label: "الإشعارات", iconKey: "Notifications" },
    { path: "/student/settings", label: "الإعدادات", iconKey: "Settings" },
    { path: "/student/bookings", label: "الحجوزات", iconKey: "Bookings" },
    { path: "/student/teachers", label: "المعلمين", iconKey: "Users" },
  ],

  parent: [
    { path: "/parent", label: "الرئيسية", iconKey: "Dashboard" },
    { path: "/parent/children", label: "الأبناء", iconKey: "Children" },
    { path: "/parent/attendance", label: "الغياب", iconKey: "Attendance" },
    { path: "/parent/grades", label: "الدرجات", iconKey: "Grades" },
    { path: "/parent/notifications", label: "الإشعارات", iconKey: "Notifications" },
    { path: "/parent/settings", label: "الإعدادات", iconKey: "Settings" },
  ],

  assistant: [
    { path: "/assistant", label: "الرئيسية", iconKey: "Dashboard" },
    { path: "/assistant/attendance", label: "الغياب", iconKey: "Attendance" },
    { path: "/assistant/bookings", label: "الحجوزات", iconKey: "Bookings" },
    { path: "/assistant/notifications", label: "الإشعارات", iconKey: "Notifications" },
  ],

  admin: [
    { path: "/admin", label: "الرئيسية", iconKey: "Dashboard" },
    { path: "/admin/users", label: "المستخدمين", iconKey: "Users" },
    { path: "/admin/statistics", label: "الإحصائيات", iconKey: "Statistics" },
    { path: "/admin/gradeLevel", label: "المستوي", iconKey: "GradeLevel" },
    { path: "/admin/packages", label: "الباقات", iconKey: "Book" },
    { path: "/admin/subscriptions", label: "الاشتراكات", iconKey: "Bookings" },
    { path: "/admin/settings", label: "الإعدادات", iconKey: "Settings" },
  ],
};
