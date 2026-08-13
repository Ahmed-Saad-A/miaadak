"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useRoleProtection = () => {
  const { user, isAuthenticated, isInitialized } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const pathSegments = pathname.split("/").filter((segment) => segment);
    if (pathSegments.length === 0) return;

    const urlRole = pathSegments[0];
    const userRole = user?.role;

    if (userRole && urlRole !== userRole) {
      router.push(`/${userRole}/dashboard`);
    }

    setIsChecking(false);
  }, [user, isAuthenticated, isInitialized, pathname, router]);

  return { isChecking };
};
