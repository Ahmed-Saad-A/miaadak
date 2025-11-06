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
  ],
  student: [
    { path: "/student", label: "لوحة القيادة", iconKey: "Dashboard"  },
    { path: "/student/lessons", label: "المحاضرات", iconKey: "Lessons" },
    { path: "/student/schedule", label: "جدولى" , iconKey: "Schedule" },
    { path: "/student/grades", label: "الدرجات", iconKey: "Grades" },
    { path: "/student/notifications", label: "الإشعارات", iconKey: "Notifications" },
    { path: "/student/settings", label: "الإعدادات", iconKey: "Settings" },
  ],
  parent: [
    { path: "/parent", label: "لوحة القيادة", iconKey: "Dashboard"  },
    { path: "/parent/children", label: "ابنى", iconKey: "Children" },
    { path: "/parent/attendance", label: "الغياب", iconKey: "Attendance" },
    { path: "/parent/grades", label: "الدرجات", iconKey: "Grades" },
    { path: "/parent/notifications", label: "الإشعارات", iconKey: "Notifications" },
    { path: "/parent/settings", label: "الإعدادات", iconKey: "Settings" },
  ],
  assistant: [
    { path: "/assistant", label: "لوحة القيادة", iconKey: "Dashboard"  },
    { path: "/assistant/attendance", label: "الغياب", iconKey: "Attendance" },
    { path: "/assistant/bookings", label: "الحجز", iconKey: "Bookings" },
    { path: "/assistant/notifications", label: "الإشعارات", iconKey: "Notifications" },
  ],
  admin: [
    { path: "/admin", label: "لوحة القيادة", iconKey: "Dashboard"  },
    { path: "/admin/users", label: "المستخدمين", iconKey: "Users" },
    { path: "/admin/statistics", label: "إحصائيات", iconKey: "Statistics" },
    { path: "/admin/settings", label: "الإعدادات", iconKey: "Settings" },
  ],
};

