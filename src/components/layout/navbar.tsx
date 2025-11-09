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
import { useUserStore } from "@/store/userStore";
import { roleNavigation } from "@/configuration/roleNavigation";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { user: zustandUser, logout: logoutZustand } = useUserStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get user from Zustand first, fallback to NextAuth session
    const user = zustandUser || (session?.user ? {
        id: session.user.id || "",
        name: session.user.name || "",
        role: (session.user.role?.toLowerCase() || null)
    } : null);

    const getNavItemsByRole = (role: string | null) => {
        if (!role) {
            return [
                { href: "/aboutUs", label: "من نحن" },
                { href: "/contact", label: "تواصل معنا" },
            ];
        }

        // Map NextAuth role names to our role keys
        const roleMap: Record<string, string> = {
            "teacher": "teacher",
            "student": "student",
            "parent": "parent",
            "assistant": "assistant",
            "admin": "admin",
            "Teacher": "teacher",
            "Student": "student",
            "Parent": "parent",
            "Assistant": "assistant",
            "Admin": "admin",
        };

        const mappedRole = roleMap[role] || role.toLowerCase();

        if (!roleNavigation[mappedRole as keyof typeof roleNavigation]) {
            return [
                { href: "/aboutUs", label: "من نحن" },
                { href: "/contact", label: "تواصل معنا" },
            ];
        }

        // Map NavigationItem[] to {href, label}[]
        const navItems = roleNavigation[mappedRole as keyof typeof roleNavigation];
        return navItems.map(item => ({
            href: item.path,
            label: item.name
        }));
    };

    const navItems = getNavItemsByRole(user?.role || null);


    const handleLogout = async () => {
        // Logout from both NextAuth and Zustand
        logoutZustand();
        await signOut({ callbackUrl: "/" });
    };

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-2 w-[90%] rounded-full border border-t-0 border-orange-500 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md">
            <div className="px-6">
                <div className="flex flex-row-reverse items-center justify-between gap-4 h-16">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Desktop Auth Buttons */}
                        <div className="hidden lg:flex items-center gap-2">
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
                    <nav className="hidden lg:flex items-center gap-6 whitespace-nowrap">
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
                    <Link href="/" className="flex items-center">
                        <Image src={MainLogo} alt="Logo" className="h-14 w-auto" />
                    </Link>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute left-0 right-0 mt-2 w-2xs bg-white shadow-lg rounded-2xl">
                        <div className="px-4 py-4">
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