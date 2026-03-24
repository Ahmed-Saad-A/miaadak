"use client";

import Link from "next/link";
import Image from "next/image";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { useSession, signOut } from "next-auth/react";
import MainLogo from "@/assets/mainLogo.png";

export function Navbar() {
    const { data: session } = useSession();

    const user = session?.user
        ? {
            id: session.user.id || "",
            name: session.user.name || "",
            role: session.user.role?.toLowerCase() || null,
        }
        : null;


    const getHomeRoute = () => {
        if (!user?.role) return "/";
        switch (user.role.toLowerCase()) {
            case "student":
                return "/student/dashboard";
            case "parent":
                return "/parent/dashboard";
            case "assistant":
                return "/assistant/dashboard";
            case "admin":
                return "/admin/dashboard";
            default:
                return "/";
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };


    return (
        <header className="my-2 mx-2 rounded-2xl max-w-[95vw] bg-white shadow-md transition-all duration-300">
            <div className="px-6">
                <div className="flex flex-row-reverse items-center justify-between gap-4 h-16">
                    {/* User / Auth Controls */}
                    <div className="flex items-center gap-2">
                        <UserDropdown
                            isAuthenticated={!!session}
                            userEmail={session?.user?.email || null}
                            userRole={session?.user?.role || null}
                            onLogout={handleLogout}
                        />
                    </div>

                    {/* Logo / Home link */}
                    <Link href={getHomeRoute()} className="flex items-center">
                        <Image src={MainLogo} alt="Logo" className="h-14 w-auto" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;