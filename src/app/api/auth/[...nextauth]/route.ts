import { servicesApi } from "@/services/api";
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
    email?: string;
    [key: string]: unknown;
}

interface ExtendedUser extends User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    role?: string;
    roleNumber?: string;
}

interface ExtendedToken extends JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    role?: string;
    roleNumber?: string;
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
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res = await servicesApi.loginUser(credentials.email, credentials.password);

                if (!res.success && res.message?.includes("not been confirmed")) {
                    throw new Error("EmailNotConfirmed");
                }

                if (!res.success && res.message?.includes("Incorrect email or password")) {
                    throw new Error("InvalidCredentials");
                }

                if (!res.success) {
                    console.error("Login failed:", res.message);
                    return null;
                }

                try {
                    if (!res.jwt || !res.refreshToken) {
                        console.error("Missing JWT or refresh token in response");
                        return null;
                    }

                    const decoded: DecodedToken = jwtDecode(res.jwt);
                    const roleFromToken =
                        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    const roleName = ["Teacher", "Student", "Parent"].includes(roleFromToken || "")
                        ? roleFromToken
                        : getRoleName(roleFromToken || "");

                    const email =
                        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
                        decoded.email ||
                        credentials.email;

                    return {
                        id: credentials.email,
                        email,
                        name: email,
                        role: roleName,
                        roleNumber: String(roleFromToken ?? ""),
                        accessToken: res.jwt,
                        refreshToken: res.refreshToken,
                        accessTokenExpires: new Date(res.jwtExpireDate!).getTime(),
                        refreshTokenExpires: new Date(res.refreshExpireDate!).getTime(),
                    };
                } catch (error) {
                    console.error("Error decoding JWT:", error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/auth/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            const extendedUser = user as ExtendedUser | undefined;
            let extendedToken = token as ExtendedToken;

            if (extendedUser) {
                extendedToken = {
                    ...extendedToken,
                    accessToken: extendedUser.accessToken,
                    refreshToken: extendedUser.refreshToken,
                    accessTokenExpires: extendedUser.accessTokenExpires,
                    refreshTokenExpires: extendedUser.refreshTokenExpires,
                    role: extendedUser.role,
                    roleNumber: extendedUser.roleNumber,
                };
            }

            if (
                extendedToken.accessTokenExpires &&
                Date.now() < extendedToken.accessTokenExpires
            ) {
                return extendedToken;
            }

            const refreshed = await refreshAccessToken(extendedToken as Required<AuthToken>);
            return refreshed as ExtendedToken;
        },

        async session({ session, token }) {
            const extendedToken = token as ExtendedToken;

            session.user = {
                ...session.user,
                accessToken: extendedToken.accessToken,
                refreshToken: extendedToken.refreshToken,
                role: extendedToken.role,
                roleNumber: extendedToken.roleNumber,
            };

            return session;
        },
    },
});

async function refreshAccessToken(token: Required<AuthToken>): Promise<AuthToken> {
    try {
        const res = await fetch("https://miaadak.runasp.net/api/v1/Account/RefreshToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jwt: token.accessToken,
                refreshJwt: token.refreshToken,
            }),
        });

        const data = await res.json();

        if (!res.ok || !data.isSucceeded || !data.data) throw data;

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
        console.error("Refresh token error:", error);
        return { ...token, error: "RefreshTokenError" };
    }
}

export { handler as GET, handler as POST };
