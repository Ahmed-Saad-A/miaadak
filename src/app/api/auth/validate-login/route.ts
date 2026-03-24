// src/app/api/auth/validate-login/route.ts
import { servicesApi } from "@/services/authApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "MissingCredentials", message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
                { status: 400 }
            );
        }

        // ✅ استدعاء API تسجيل الدخول مباشرة
        const response = await fetch("https://miaadak.runasp.net/api/v1/Account/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const res = await response.json();

        console.log("Login API Response:", res); // للتشخيص

        // ✅ معالجة حالة الإيميل غير المؤكد
        if (!res.isSucceeded && res.message?.includes("not been confirmed")) {

            // 👇 استدعاء resend email
            await servicesApi.resendConfirmationEmail(email);

            return NextResponse.json(
                {
                    success: false,
                    error: "EmailNotConfirmed",
                    message: "يرجي الذهاب لتأكيد بريدك الألكتروني",
                    email
                },
                { status: 403 }
            );
        }


        // ✅ معالجة حالة بيانات تسجيل الدخول الخاطئة
        if (!res.isSucceeded && res.message?.includes("Incorrect email or password")) {
            return NextResponse.json(
                { success: false, error: "InvalidCredentials", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
                { status: 401 }
            );
        }

        // ✅ معالجة أي أخطاء أخرى
        if (!res.isSucceeded) {
            return NextResponse.json(
                { success: false, error: "LoginFailed", message: res.message || "فشل تسجيل الدخول" },
                { status: 401 }
            );
        }

        // ✅ نجاح - البيانات صحيحة
        return NextResponse.json(
            { success: true, message: "البيانات صحيحة" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Validate login error:", error);
        return NextResponse.json(
            { success: false, error: "UnknownError", message: "حدث خطأ غير متوقع" },
            { status: 500 }
        );
    }
}