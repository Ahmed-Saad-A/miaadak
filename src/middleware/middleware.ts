// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/", "/aboutUs"];
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];
const PROTECTED_PREFIXES = ["/teacher", "/student", "/parent", "/assistant", "/admin"];

const DEFAULT_ROUTES: Record<string, string> = {
    teacher: "/teacher/dashboard",
    student: "/student/dashboard",
    parent: "/parent/dashboard",
    assistant: "/assistant/dashboard",
    admin: "/admin/dashboard",
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Ignore static files and API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/)
    ) {
        return NextResponse.next();
    }

    //  Get token - IMPORTANT: Use same secret as NextAuth
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log(" Middleware:", {
        pathname,
        hasToken: !!token,
        role: token?.role,
        email: token?.email,
    });

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    //  User is authenticated
    if (token) {
        const role = (token.role as string)?.toLowerCase();

        if (!role) {
            console.error("❌ Token exists but no role found");
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        //  Redirect logged-in users from public/auth pages
        if (isPublicRoute || isAuthRoute) {
            const defaultRoute = DEFAULT_ROUTES[role] || "/";
            console.log(`🔄 Redirecting ${role} from ${pathname} to ${defaultRoute}`);
            return NextResponse.redirect(new URL(defaultRoute, req.url));
        }

        //  Check role-based access
        if (isProtectedRoute) {
            const urlRole = pathname.split("/")[1] as string;

            if (urlRole !== role) {
                const defaultRoute = DEFAULT_ROUTES[role] || "/";
                console.log(`🔄 Role mismatch: redirecting to ${defaultRoute}`);
                return NextResponse.redirect(new URL(defaultRoute, req.url));
            }
        }

        return NextResponse.next();
    }

    console.log(`❌ No token for ${pathname}`);

    if (isProtectedRoute) {
        console.log(`🔒 Redirecting to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};