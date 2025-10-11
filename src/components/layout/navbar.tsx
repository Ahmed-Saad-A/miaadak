"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/ui/user-dropdown";
import React, { useState } from "react";
import Image from "next/image";
import MainLogo from "@/assets/mainLogo.png";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getNavItemsByRole = (role: string | null) => {
        console.log("🚀 ~ getNavItemsByRole ~ role:", role);
        switch (role) {
            case "Teacher":
                return [
                    { href: "/students", label: "طلابي" },
                    { href: "/my-lessons", label: "دروسي" },
                    { href: "/contact", label: "تواصل معنا" },
                ];
            case "Student":
                return [
                    { href: "/lessons", label: "الدروس" },
                    { href: "/teachers", label: "المعلمون" },
                    { href: "/contact", label: "تواصل معنا" },
                ];
            case "Parent":
                return [
                    { href: "/children-progress", label: "تقدم الأبناء" },
                    { href: "/contact", label: "تواصل معنا" },
                ];
            default:
                return [
                    { href: "/teachers", label: "المعلمون" },
                    { href: "/contact", label: "تواصل معنا" },
                ];
        }
    };

    const navItems = getNavItemsByRole(session?.user?.role || null);


    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-orange-500 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-row-reverse h-16 items-center justify-between">

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {/* Desktop Auth Buttons */}
                        <div className="hidden lg:flex items-center space-x-2">
                            <UserDropdown
                                isAuthenticated={!!session}
                                userEmail={session?.user?.email || null}
                                userRole={session?.user?.role || null}
                                onLogout={handleLogout}
                            />
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
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navItems.map((navItem) => {
                            const isActive = pathname === navItem.href;
                            return (
                                <Link
                                    key={navItem.href}
                                    href={navItem.href}
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${isActive
                                        ? "bg-orange-500 text-white shadow-md font-semibold"
                                        : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                                        }`}
                                >
                                    {navItem.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src={MainLogo} alt="Logo" className="h-16 w-auto" />
                    </Link>
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
                                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
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
                                    <UserDropdown
                                        isAuthenticated={!!session}
                                        userEmail={session?.user?.email || null}
                                        userRole={session?.user?.role || null}
                                        onLogout={handleLogout}
                                        isMobile={true}
                                    />
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