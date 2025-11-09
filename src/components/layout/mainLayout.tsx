"use client";

import { useSession } from "next-auth/react";
import { Navbar, Footer } from "@/components/layout";
import Sidebar from "@/components/layout/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />  {/* grid-area: 1 / 1 / 2 / 5 */}

            <div className="flex flex-1 flex-row-reverse">
                {user && (
                    <aside>
                        <Sidebar />  {/* grid-area: 1 / 5 / 6 / 6 */}
                    </aside>
                )}

                <main className="flex-1 p-6 bg-gray-50">
                    {children}  {/* grid-area: 2 / 1 / 5 / 5 */}
                </main>
            </div>

            {/* <Footer />  */}
        </div>
    );
}
