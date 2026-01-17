// src/components/layout/sidebar.tsx
"use client";

import { JSX } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { roleRoutes } from "@/configuration/roles";
import type { Role } from "@/interfaces/roles";
import { SessionUser } from "@/interfaces";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Book,
    Bell,
    Settings,
    UserCircle,
    ClipboardList,
    BarChart3,
    ChevronRight,
    ChevronLeft,
    Home,
    Info,
} from "lucide-react";
import Image from "next/image";
import MainLogo from "@/assets/mainLogo.png";

const icons: Record<string, JSX.Element> = {
    Home: <Home size={20} />,
    About: <Info size={20} />,
    Dashboard: <LayoutDashboard size={20} />,
    Schedule: <CalendarDays size={20} />,
    Students: <Users size={20} />,
    Attendance: <ClipboardList size={20} />,
    Assistant: <UserCircle size={20} />,
    Grades: <Book size={20} />,
    Notifications: <Bell size={20} />,
    Settings: <Settings size={20} />,
    Statistics: <BarChart3 size={20} />,
    Bookings: <ClipboardList size={20} />,
    Lessons: <Book size={20} />,
    Children: <Users size={20} />,
    Users: <Users size={20} />,
};

const guestNavigation = [
    { path: "/", label: "الرئيسية", iconKey: "Home" },
    { path: "/aboutUs", label: "من نحن", iconKey: "About" },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { data: session } = useSession();
    console.log("🚀 ~ Sidebar ~ session:", session)
    const pathname = usePathname();

    const user = session?.user as SessionUser | undefined;
    console.log("🚀 ~ Sidebar ~ user:", user)
    const role = user?.role?.toLowerCase() as Role | undefined;
    console.log("🚀 ~ Sidebar ~ role:", role)

    const routes = role && roleRoutes[role] ? roleRoutes[role] : guestNavigation;
    console.log("🚀 ~ Sidebar ~ routes:", routes)

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside
            className={`fixed top-2 right-2 h-[97vh] pb-10 my-auto mb-5 bg-orange-500 text-white transition-all duration-300 flex flex-col items-center py-6 shadow-lg ${isOpen ? "w-56 rounded-2xl" : "w-16 rounded-2xl"
                }`}
        >
            <button
                onClick={toggleSidebar}
                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 z-50 ${isOpen ? "left-0 -translate-x-1/2" : "left-1/2 -translate-x-1/2"
                    }`}
                aria-label={isOpen ? "إغلاق القائمة الجانبية" : "فتح القائمة الجانبية"}
            >
                {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div className="mb-8">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Image src={MainLogo} alt="Logo" className="w-auto" />
                </div>
            </div>

            <nav className="flex flex-col gap-4 w-full px-2">
                {routes.map((item) => {
                    // ✅ تحسين: يعتبر الصفحة active إذا pathname يبدأ بـ item.path
                    // أو إذا pathname === item.path بالظبط
                    const isActive = pathname === item.path ||
                        (item.path !== "/" && pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${isActive
                                    ? "bg-white text-orange-500 font-semibold shadow-md" // ✅ إضافة shadow
                                    : "text-white hover:bg-white/20"
                                }`}
                        >
                            {icons[item.iconKey] || <LayoutDashboard size={20} />}
                            {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}