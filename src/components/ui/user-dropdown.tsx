"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { signOut } from "next-auth/react";

interface UserDropdownProps {
    isAuthenticated: boolean;
    userEmail: string | null;
    userRole: string | null;
    onLogout: () => void;
    isMobile?: boolean;
}

export function UserDropdown({ isAuthenticated, userEmail, userRole, onLogout, isMobile = false }: UserDropdownProps) {
    const pathname = usePathname();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
        setIsUserDropdownOpen(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center space-x-2">
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
                        <Button
                            variant="outline"
                            asChild
                            className="border-orange-500 ms-4 text-orange-500 hover:bg-orange-500 hover:text-white"
                        >
                            <Link href="/auth/login">تسجيل الدخول</Link>
                        </Button>
                        <Button
                            asChild
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            <Link href="/auth/register">إنشاء حساب</Link>
                        </Button>
                    </>
                )}
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="w-full">
                <div className="flex items-center gap-2 p-2 mb-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={userEmail || "User"} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-medium text-sm">{userEmail}</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                        <Link href="/profile">الملف الشخصي</Link>
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

    return (
        <DropdownMenu open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={userEmail || "User"} />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{userEmail}</p>
                        <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                </div>
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        الملف الشخصي
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserDropdown;
