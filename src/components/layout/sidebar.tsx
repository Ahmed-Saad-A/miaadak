"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { roleRoutes } from "@/configuration/roles";
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
} from "lucide-react";
import Image from "next/image";
import MainLogo from "@/assets/mainLogo.png";

const icons: Record<string, JSX.Element> = {
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
};

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUserStore();
    const routes = roleRoutes[user?.role as keyof typeof roleRoutes] || [];

    if (!user) return null;

    return (
        <aside
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className={`fixed top-24 right-2 h-fit pb-10 my-auto mb-5 bg-orange-500 text-white transition-all duration-300 flex flex-col items-center py-6 shadow-lg ${isOpen ? "w-56 rounded-2xl" : "w-16 rounded-2xl"
                }`}
        >
            {/* Logo */}
            <div className="mb-8">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Image src={MainLogo} alt="Logo" className="w-auto" />
                </div>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-4 w-full px-2">
                {routes.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className="flex items-center gap-3 text-white hover:bg-white/20 rounded-xl px-3 py-2 transition-all"
                    >
                        {icons[item.iconKey] || <LayoutDashboard size={20} />}
                        {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
