"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import logo from "../../assets/Logo.png";
import { Button } from "@/components";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { href: "/contact", label: "تواصل معنا" },
        { href: "/teachers", label: "المعلمون" },
        { href: "/lessons", label: "الدروس" },
        { href: "/", label: "الرئيسية" },
    ];

    const navigate = (href: string) => {
        setIsMobileMenuOpen(false);
        router.replace(href);
    };

    useEffect(() => {
        const nav = document.getElementById("navbar");
        const handleScroll = () => {
            if (window.scrollY > 50) {
                nav?.classList.add("bg-white/90", "shadow-xl");
                nav?.classList.remove("bg-white/30");
            } else {
                nav?.classList.add("bg-white/30");
                nav?.classList.remove("bg-white/90", "shadow-xl");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <nav
            id="navbar"
            className="fixed top-4 left-1/2 -translate-x-1/2 w-full  mx-auto px-6 py-3 rounded-2xl backdrop-blur-md bg-white/30 shadow-lg z-50 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-4">
                {/* Left: Buttons */}
                <div className="flex items-center gap-3 justify-start">
                    <Button
                        
                        className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition font-medium"
                    >
                        تسجيل الدخول
                    </Button>
                    <Button
                        
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                    >
                        إنشاء حساب
                    </Button>

                    {/* Mobile Menu Button */}
                    <Button
                        onClick={() => setIsMobileMenuOpen((s) => !s)}
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 ml-2"
                        aria-label="قائمة"
                    >
                        {isMobileMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </Button>
                </div>

                {/* Center: Tabs */}
                <ul className="hidden md:flex justify-center gap-8 text-gray-700 font-medium">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <li
                                key={item.href}
                                onClick={() => navigate(item.href)}
                                className={`cursor-pointer transition px-2 py-1 ${active
                                    ? "text-orange-500 font-semibold border-b-2 border-orange-500"
                                    : "hover:text-orange-500"
                                    }`}
                            >
                                {item.label}
                            </li>
                        );
                    })}
                </ul>

                {/* Right: Logo */}
                <div className="flex justify-end items-center">
                    <div className="flex items-center gap-2">
                        {/* <Image src={logo} alt="Logo" width={56} className="object-contain" /> */}
                        <span className="hidden md:inline text-xl font-bold text-orange-500">ميعادك</span>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-3 px-4">
                    <div className="bg-white rounded-lg shadow p-4 space-y-3 animate-fadeIn">
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <li
                                        key={item.href}
                                        onClick={() => navigate(item.href)}
                                        className={`py-2 px-3 rounded-md cursor-pointer transition ${active
                                            ? "bg-orange-500 text-white font-semibold"
                                            : "hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        {item.label}
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={() => navigate("/signup")}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                إنشاء حساب
                            </Button>
                            <Button
                                onClick={() => navigate("/login")}
                                className="flex-1 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white"
                            >
                                تسجيل الدخول
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>

    );
};

export default Navbar;
