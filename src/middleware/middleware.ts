// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role?.toLowerCase();

    // ✅ إذا المستخدم مسجل دخول ودخل على الصفحة الرئيسية، وجهه لصفحة الـ role
    if (pathname === "/" && role) {
      const roleRedirects: Record<string, string> = {
        teacher: "/teacher",
        student: "/student",
        parent: "/parent",
        assistant: "/assistant",
        admin: "/admin",
      };

      const redirectPath = roleRedirects[role];
      if (redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }

    // ✅ منع الوصول للصفحات غير المصرح بها
    if (pathname.startsWith("/teacher") && role !== "teacher")
      return NextResponse.redirect(new URL("/", req.url));

    if (pathname.startsWith("/student") && role !== "student")
      return NextResponse.redirect(new URL("/", req.url));

    if (pathname.startsWith("/parent") && role !== "parent")
      return NextResponse.redirect(new URL("/", req.url));

    if (pathname.startsWith("/assistant") && role !== "assistant")
      return NextResponse.redirect(new URL("/", req.url));

    if (pathname.startsWith("/admin") && role !== "admin")
      return NextResponse.redirect(new URL("/", req.url));

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/teacher/:path*",
    "/student/:path*",
    "/parent/:path*",
    "/assistant/:path*",
    "/admin/:path*",
  ],
};