// src/app/api/auth/[...nextauth]/route.ts
import { servicesApi } from "@/services/authApi";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";

interface AuthToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires?: number;
    error?: string;
}

interface DecodedToken {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"?: string;
    email?: string;
}

interface ExtendedUser extends User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    role?: string;
    roleNumber?: string;
    userId?: string;
}

interface ExtendedToken extends JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    role?: string;
    roleNumber?: string;
    userId?: string;
    error?: string;
}

const getRoleName = (roleNumber: string | number): string => {
    switch (String(roleNumber)) {
        case "1":
            return "Teacher";
        case "2":
            return "Student";
        case "3":
            return "Parent";
        default:
            return "Unknown";
    }
};

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,

    // ✅ CRITICAL: Session configuration
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // ✅ 30 days
        updateAge: 24 * 60 * 60,   // ✅ Update every 24 hours
    },

    // ✅ JWT configuration
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // ✅ 30 days
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await servicesApi.loginUser(credentials.email, credentials.password);

                    console.log("✅ Login Response:", {
                        success: res.success,
                        hasJwt: !!res.jwt,
                        hasRefreshToken: !!res.refreshToken,
                    });

                    if (!res.success) {
                        console.error("❌ Login failed:", res.message);
                        return null;
                    }

                    if (!res.jwt || !res.refreshToken) {
                        console.error("❌ Missing JWT or refresh token");
                        return null;
                    }

                    const decoded: DecodedToken = jwtDecode(res.jwt);

                    const userId =
                        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid"];

                    const roleFromToken =
                        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                    let roleName = ["Teacher", "Student", "Parent"].includes(roleFromToken || "")
                        ? roleFromToken
                        : getRoleName(roleFromToken || "");

                    // ✅ Admin exception
                    if (credentials.email === "miaadakplatform@gmail.com") {
                        roleName = "Admin";
                    }

                    const email =
                        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
                        decoded.email ||
                        credentials.email;

                    console.log("✅ User authorized:", {
                        email,
                        role: roleName,
                        userId,
                    });

                    return {
                        id: credentials.email,
                        email,
                        name: email,
                        role: roleName,
                        userId,
                        roleNumber: String(roleFromToken ?? ""),
                        accessToken: res.jwt,
                        refreshToken: res.refreshToken,
                        accessTokenExpires: new Date(res.jwtExpireDate!).getTime(),
                        refreshTokenExpires: new Date(res.refreshExpireDate!).getTime(),
                    } as ExtendedUser;
                } catch (error) {
                    console.error("❌ Error during authorization:", error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/auth/login",
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            const extendedUser = user as ExtendedUser | undefined;
            let extendedToken = token as ExtendedToken;

            // ✅ Initial sign in
            if (extendedUser) {
                console.log("🔑 Setting initial JWT token for:", extendedUser.email);
                extendedToken = {
                    ...extendedToken,
                    accessToken: extendedUser.accessToken,
                    refreshToken: extendedUser.refreshToken,
                    accessTokenExpires: extendedUser.accessTokenExpires,
                    refreshTokenExpires: extendedUser.refreshTokenExpires,
                    role: extendedUser.role,
                    roleNumber: extendedUser.roleNumber,
                    userId: extendedUser.userId,
                };
            }

            // ✅ Handle session update
            if (trigger === "update" && session) {
                console.log("🔄 Updating session");
                extendedToken = { ...extendedToken, ...session };
            }

            // ✅ Return existing token if not expired
            if (
                extendedToken.accessTokenExpires &&
                Date.now() < extendedToken.accessTokenExpires
            ) {
                return extendedToken;
            }

            // ✅ Refresh token if expired
            console.log("⏰ Token expired, refreshing...");
            const refreshed = await refreshAccessToken(extendedToken as Required<AuthToken>);
            return refreshed as ExtendedToken;
        },

        async session({ session, token }) {
            const extendedToken = token as ExtendedToken;

            // ✅ CRITICAL: Include role in session
            session.user = {
                ...session.user,
                id: extendedToken.sub || "",
                accessToken: extendedToken.accessToken,
                refreshToken: extendedToken.refreshToken,
                role: extendedToken.role,
                roleNumber: extendedToken.roleNumber,
                userId: extendedToken.userId,
            };

            console.log("📦 Session created:", {
                email: session.user.email,
                role: session.user.role,
                hasToken: !!session.user.accessToken,
            });

            return session;
        },
    },

    // ✅ Enable debug in development
    debug: process.env.NODE_ENV === "development",
});

async function refreshAccessToken(token: Required<AuthToken>): Promise<AuthToken> {
    try {
        console.log("🔄 Attempting to refresh access token...");

        const res = await fetch("https://miaadak.runasp.net/api/v1/Account/RefreshToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jwt: token.accessToken,
                refreshJwt: token.refreshToken,
            }),
        });

        const data = await res.json();

        if (!res.ok || !data.isSucceeded || !data.data) {
            console.error("❌ Refresh token failed:", data);
            throw data;
        }

        console.log("✅ Token refreshed successfully");

        return {
            ...token,
            accessToken: data.data.jwtModel.jwt,
            accessTokenExpires: new Date(data.data.jwtModel.jwtExpireDate).getTime(),
            refreshToken: data.data.refreshJWTModel.refreshJWT ?? token.refreshToken,
            refreshTokenExpires: new Date(
                data.data.refreshJWTModel.refreshExpireDate
            ).getTime(),
        };
    } catch (error) {
        console.error("❌ Refresh token error:", error);
        return { ...token, error: "RefreshTokenError" };
    }
}

export { handler as GET, handler as POST };