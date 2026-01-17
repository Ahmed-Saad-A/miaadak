// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { Role } from "@/interfaces/roles";
import { roleRoutes } from "@/configuration/roles";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    const role = (token?.role as string)?.toLowerCase() as Role;

    // 🔁 لو مسجل دخول وداخل auth pages
    if (pathname.startsWith("/auth")) {
      const defaultRoute = roleRoutes[role]?.[0]?.path || "/teacher/dashboard";
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }

    // 🔐 Role protection
    if (pathname.startsWith("/teacher")) {
      if (role !== "teacher") {
        return NextResponse.redirect(
          new URL(roleRoutes[role]?.[0]?.path || "/", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 👈 ده المهم
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/teacher/:path*",
    "/student/:path*",
    "/parent/:path*",
    "/assistant/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
