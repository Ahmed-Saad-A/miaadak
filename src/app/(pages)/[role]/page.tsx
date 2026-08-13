"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Role } from "@/interfaces/roles";
import { roleRoutes } from "@/configuration/roles";

export default function RoleIndexPage() {
    const router = useRouter();
    const params = useParams();
    const role = params.role as Role;

    useEffect(() => {
        const defaultRoute = roleRoutes[role]?.[0]?.path;
        if (defaultRoute) router.replace(defaultRoute);
    }, [role, router]);

    return null;
}
