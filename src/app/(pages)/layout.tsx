// src/app/(pages)/layout.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout";
import Sidebar from "@/components/layout/sidebar";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const user = session?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-1 flex-row-reverse relative transition-all duration-300"
                style={{
                    marginRight: isSidebarOpen ? "15rem" : "5rem"
                }}
            >
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Content Container */}
                <div className="flex flex-col flex-1 w-full">
                    {/* Navbar */}
                    <Navbar />

                    {/* Main content */}
                    <main className="max-w-[95vw] bg-white flex-1 rounded-2xl transition-all duration-300 mx-2 my-2">
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile & Tablet Layout */}
            <div className="lg:hidden flex flex-col flex-1 pt-16">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Main content - Full width on mobile */}
                <main className="bg-white flex-1 m-2 rounded-2xl">
                    {children}
                </main>
            </div>
        </div>
    );
}