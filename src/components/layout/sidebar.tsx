// src/components/layout/sidebar.tsx
"use client";

import { JSX } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { roleRoutes } from "@/configuration/roles";
import type { Role } from "@/interfaces/roles";
import { SessionUser } from "@/interfaces";
import { UserDropdown } from "@/components/ui/user-dropdown";
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
    Menu,
    X,
    LayoutList,
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
    GradeLevel: <LayoutList  size={20} />,
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
    const pathname = usePathname();

    const user = session?.user as SessionUser | undefined;
    const role = user?.role?.toLowerCase() as Role | undefined;
    const routes = role && roleRoutes[role] ? roleRoutes[role] : guestNavigation;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        // إغلاق السايدبار تلقائياً عند الاختيار في الشاشات الصغيرة
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Navbar للشاشات الصغيرة فقط */}
            <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-orange-500 text-white flex items-center justify-between px-4 shadow-lg z-40">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="فتح القائمة"
                >
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <Image src={MainLogo} alt="Logo" className="w-8 h-8 dark:invert-0" />
                </div>
                <div className="flex items-center">
                    <UserDropdown
                        isAuthenticated={!!user}
                        userEmail={user?.email || null}
                        userRole={user?.role || null}
                        onLogout={() => signOut({ callbackUrl: "/" })}
                    />
                </div>
            </nav>

            {/* Overlay للشاشات الصغيرة */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-16"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    bg-orange-500 text-white transition-all duration-300 flex flex-col py-6 shadow-lg
                    
                    /* Desktop - Fixed positioned */
                    lg:fixed lg:top-2 lg:right-2 lg:h-[97vh] lg:pb-4 lg:items-center
                    ${isOpen ? "lg:w-56 lg:rounded-2xl" : "lg:w-16 lg:rounded-2xl"}
                    
                    /* Mobile & Tablet - Absolute positioned with full overlay */
                    max-lg:fixed max-lg:top-16 max-lg:right-0 max-lg:h-[calc(100vh-4rem)] max-lg:w-64 max-lg:z-50
                    ${isOpen ? "max-lg:translate-x-0" : "max-lg:translate-x-full"}
                `}
            >
                {/* زر الإغلاق للشاشات الصغيرة */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="إغلاق القائمة"
                >
                    <X size={24} />
                </button>

                {/* زر Toggle للشاشات الكبيرة - في الأعلى */}
                <button
                    onClick={toggleSidebar}
                    className={`
                        hidden lg:flex
                        absolute top-16 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white 
                        rounded-full items-center justify-center shadow-lg border-2 border-white 
                        transition-all duration-300
                        ${isOpen ? "left-0 -translate-x-1/2" : "left-0 -translate-x-1/2"}
                    `}
                    aria-label={isOpen ? "إغلاق القائمة الجانبية" : "فتح القائمة الجانبية"}
                >
                    {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {/* Logo - Desktop only */}
                <div className="mb-8 hidden lg:block">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Image src={MainLogo} alt="Logo" className="w-auto dark:invert-0" />
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 w-full px-2 flex-1 overflow-hidden">
                    <div className="flex flex-col gap-2">
                        {routes.map((item) => {
                            const isDashboard =
                                item.path === `/${role}` && pathname === `/${role}`;

                            const isActive =
                                isDashboard ||
                                (item.path !== `/${role}` && pathname.startsWith(item.path));

                            return (
                                <div key={item.path} className="relative group">
                                    <Link
                                        href={item.path}
                                        onClick={handleLinkClick}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all flex-shrink-0 ${
                                            isActive
                                                ? "bg-white text-orange-500 font-semibold shadow-md"
                                                : "text-white hover:bg-white/20"
                                        }`}
                                    >
                                        {icons[item.iconKey] || <LayoutDashboard size={20} />}
                                        <span className={`whitespace-nowrap ${isOpen ? "lg:block" : "lg:hidden"} max-lg:block`}>
                                            {item.label}
                                        </span>
                                    </Link>

                                    {/* ✅ Tooltip - يظهر فقط في الشاشات الكبيرة لما السايدبار مقفول */}
                                    {!isOpen && (
                                        <div className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 mr-2 pointer-events-none z-50">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium">
                                                {item.label}
                                                {/* السهم */}
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1">
                                                    <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </aside>
        </>
    );
}