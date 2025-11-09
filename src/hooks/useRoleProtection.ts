"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useRoleProtection = () => {
    const { user, isAuthenticated, isInitialized } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }

        const pathSegments = pathname.split("/").filter(Boolean);
        if (pathSegments.length === 0) return;

        const urlRole = pathSegments[0];
        const userRole = user?.role;

        if (userRole && urlRole !== userRole) {
            router.push(`/${userRole}/dashboard`);
        }
    }, [user, isAuthenticated, isInitialized, pathname, router]);
};
