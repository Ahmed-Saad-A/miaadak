import { Role } from "@/interfaces/roles";

interface NavigationItem {
  name: string;
  path: string;
}

export const roleNavigation: Record<Role, NavigationItem[]> = {
  teacher: [
    { name: "لوحة القيادة", path: "/teacher/dashboard" },
    { name: "الجدول", path: "/teacher/schedule" },
    { name: "الطلاب", path: "/teacher/students" },
    { name: "الغياب", path: "/teacher/attendance" },
    { name: "المساعدين", path: "/teacher/assistant" },
    { name: "الدرجات", path: "/teacher/grades" },
    { name: "الإشعارات", path: "/teacher/notifications" },
    { name: "الإعدادات", path: "/teacher/settings" },
  ],
  student: [
    { name: "لوحة القيادة", path: "/student/dashboard" },
    { name: "المحاضرات", path: "/student/lessons" },
    { name: "جدولي", path: "/student/schedule" },
    { name: "الدرجات", path: "/student/grades" },
    { name: "الإشعارات", path: "/student/notifications" },
    { name: "الإعدادات", path: "/student/settings" },
  ],
  parent: [
    { name: "لوحة القيادة", path: "/parent/dashboard" },
    { name: "ابني", path: "/parent/children" },
    { name: "الغياب", path: "/parent/attendance" },
    { name: "الدرجات", path: "/parent/grades" },
    { name: "الإشعارات", path: "/parent/notifications" },
    { name: "الإعدادات", path: "/parent/settings" },
  ],
  assistant: [
    { name: "لوحة القيادة", path: "/assistant/dashboard" },
    { name: "الغياب", path: "/assistant/attendance" },
    { name: "الحجز", path: "/assistant/bookings" },
    { name: "الإشعارات", path: "/assistant/notifications" },
  ],
  admin: [
    { name: "لوحة القيادة", path: "/admin/dashboard" },
    { name: "المستخدمين", path: "/admin/users" },
    { name: "إحصائيات", path: "/admin/statistics" },
    { name: "الإعدادات", path: "/admin/settings" },
  ],
};
