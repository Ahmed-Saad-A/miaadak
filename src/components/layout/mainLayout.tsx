"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout";
import Sidebar from "@/components/layout/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const user = session?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className={`flex flex-1 flex-row-reverse relative transition-all duration-300 ${isSidebarOpen ? "mr-[15rem]" : "mr-20"}`}>
                {/* Sidebar */}
                {user && (
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                )}

                {/* Content Container */}
                <div className="flex flex-col flex-1 w-full">
                    {/* Navbar */}
                    <Navbar />

                    {/* Main content */}
                    <main className="max-w-[95vw] bg-white flex-1 rounded-2xl transition-all duration-300 p-6 shadow-md mx-2 my-2">
                        {children}
                    </main>
                </div>
            </div>

            {/* <Footer /> */}
        </div>
    );
}
