"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, UserCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { signOut } from "next-auth/react";
import userImg from "@/assets/male.png";
import Image from "next/image";

interface UserDropdownProps {
    isAuthenticated: boolean;
    userEmail: string | null;
    userRole: string | null;
    onLogout: () => void;
    isMobile?: boolean;
    unreadCount?: number;
}

export function UserDropdown({
    isAuthenticated,
    userEmail,
    userRole,
    onLogout,
    isMobile = false,
    unreadCount = 0,
}: UserDropdownProps) {
    const pathname = usePathname();
    const getBasePath = () => {
        const segments = pathname.split("/").filter(Boolean);
        return segments.length > 0 ? `/${segments[0]}` : "";
    };

    const ROLE_AR: Record<string, string> = {
        admin: "مدير",
        teacher: "معلم",
        student: "طالب",
        parent: "ولي أمر",
        assistant: "مساعد",
    };

    const roleAr = userRole ? (ROLE_AR[userRole.toLowerCase()] ?? userRole) : null;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
        onLogout?.();
    };

    // ── غير مسجّل ──────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-2" dir="rtl">
                {pathname.startsWith("/auth/login") ? (
                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href="/auth/register">إنشاء حساب</Link>
                    </Button>
                ) : pathname.startsWith("/auth/register") ? (
                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href="/auth/login">تسجيل الدخول</Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Link href="/auth/register">إنشاء حساب</Link>
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        >
                            <Link href="/auth/login">تسجيل الدخول</Link>
                        </Button>
                    </>
                )}
            </div>
        );
    }

    // ── موبايل ────────────────────────────────────────────────────────────
    if (isMobile) {
        return (
            <div className="w-full" dir="rtl">
                <div className="flex items-center gap-3 p-2 mb-2">
                    <Avatar>
                        <Image src={userImg} alt={userEmail ?? "User"} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-right">
                        <p className="font-medium text-sm">{userEmail}</p>
                        <p className="text-xs text-gray-500">{roleAr}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                        <Link href={`${getBasePath()}/profile`}>الملف الشخصي</Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        تسجيل الخروج
                    </Button>
                </div>
            </div>
        );
    }

    // ── ديسكتوب ───────────────────────────────────────────────────────────
    return (
        <div className="flex items-center gap-1" dir="rtl">

            {/* أيقونة الإشعارات */}
            <Link href={`${getBasePath()}/notifications`}>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-white/20 text-white"
                    aria-label="الإشعارات"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500
                                         text-[10px] font-bold text-white flex items-center justify-center leading-none">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </Link>

            {/* Avatar Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <Image src={userImg} alt={userEmail ?? "User"} />
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-52 rounded-xl border border-gray-100 bg-white shadow-lg p-2"
                    align="end"
                    sideOffset={8}
                >
                    <div dir="rtl">
                        {/* معلومات المستخدم */}
                        <div className="flex items-center gap-3 p-2 border-b border-orange-100 mb-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-orange-100 text-orange-600">
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right min-w-0">
                                <p className="text-sm font-semibold truncate" dir="ltr">{userEmail}</p>
                                <p className="text-xs text-gray-500">{roleAr}</p>
                            </div>
                        </div>

                        {/* الملف الشخصي */}
                        <DropdownMenuItem asChild>
                            <Link href={`${getBasePath()}/profile`} className="flex items-center gap-2 w-full">
                                <UserCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span className="flex-1">الملف الشخصي</span>
                            </Link>
                        </DropdownMenuItem>

                        {/* الإشعارات */}
                        <DropdownMenuItem asChild>
                            <Link href={`${getBasePath()}/notifications`} className="flex items-center gap-2 w-full">
                                <Bell className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                <span className="flex-1">الإشعارات</span>
                                {unreadCount > 0 && (
                                    <span className="h-5 w-5 rounded-full bg-red-500 text-[10px]
                                                 font-bold text-white flex items-center justify-center flex-shrink-0">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Link>
                        </DropdownMenuItem>

                        {/* تسجيل الخروج */}
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 focus:bg-red-50 w-full"
                        >
                            <LogOut className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">تسجيل الخروج</span>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default UserDropdown;