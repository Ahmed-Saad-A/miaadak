// src/components/providers/auth-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider
            //  Refetch session every 5 minutes
            refetchInterval={30000}
            //  Refetch when window gets focus
            refetchOnWindowFocus={true}
        >
            {children}
        </SessionProvider>
    );
}