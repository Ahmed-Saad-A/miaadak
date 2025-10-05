"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navItems = [
        { href: "/contact", label: "تواصل معنا" },
        { href: "/teachers", label: "المعلمون" },
        { href: "/lessons", label: "الدروس" },
        { href: "/", label: "الرئيسية" },
    ];

    // useEffect(() => {
    //     // Basic auth check via localStorage token set on login
    //     try {
    //         const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    //         setIsAuthenticated(Boolean(token));
    //     } catch {}
    // }, [pathname]);

    function handleLogout() {
        try {
            localStorage.removeItem("auth_token");
        } catch {}
        setIsAuthenticated(false);
        router.push("/");
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-row-reverse h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                م
                            </span>
                        </div>
                        <span className="font-bold text-xl text-orange-500">ميعادك</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navItems.map((navItem) => {
                            const isActive = pathname === navItem.href;
                            return (
                                <Link
                                    key={navItem.href}
                                    href={navItem.href}
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                                        isActive
                                            ? "bg-orange-500 text-white shadow-md font-semibold"
                                            : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                                    }`}
                                >
                                    {navItem.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {/* Desktop Auth Buttons */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {isAuthenticated ? (
                                <>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleLogout}
                                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                                    >
                                        تسجيل الخروج
                                    </Button>
                                </>
                            ) : (
                                <>
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
                                                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
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
                                </>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                            <span className="sr-only">قائمة</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute start-0 end-0 border-t bg-white shadow-lg">
                        <div className="container mx-auto px-4 py-4">
                            <nav className="flex flex-col space-y-2">
                                {navItems.map((navItem) => {
                                    const isActive = pathname === navItem.href;

                                    return (
                                        <Link
                                            key={navItem.href}
                                            href={navItem.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? "bg-orange-500 text-white shadow-sm"
                                                    : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                                            }`}
                                        >
                                            {navItem.label}
                                        </Link>
                                    );
                                })}
                                
                                {/* Mobile Auth Buttons */}
                                <div className="flex gap-2 pt-2 mt-2 border-t">
                                    {isAuthenticated ? (
                                        <Button 
                                            variant="outline"
                                            onClick={handleLogout}
                                            className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                                        >
                                            تسجيل الخروج
                                        </Button>
                                    ) : (
                                        <>
                                            <Button 
                                                asChild
                                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                                            >
                                                <Link href="/auth/register">إنشاء حساب</Link>
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                asChild
                                                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                                            >
                                                <Link href="/auth/login">تسجيل الدخول</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
