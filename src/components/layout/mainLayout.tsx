"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar, Footer } from "@/components/layout";
import Sidebar from "@/components/layout/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const user = session?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1 flex-row-reverse relative">
                {/* Sidebar */}
                {user && (
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                )}

                {/* Main content */}
                <main
                    className={`flex-1 transition-all duration-300 p-6 ${isSidebarOpen ? "mr-64" : "mr-0"
                        }`}
                >
                    {children}
                </main>
            </div>

            {/* <Footer /> */}
        </div>
    );
}
