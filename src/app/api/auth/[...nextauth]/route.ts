import { servicesApi } from "@/services/api";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

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
    [key: string]: any;
}

// Map role numbers to role names
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
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res = await servicesApi.loginUser(credentials.email, credentials.password);
                console.log("🚀 ~ authorize ~ res:", res)

                if (res.success) {
                    try {
                        // Decode JWT to get user role
                        const decoded: DecodedToken = jwtDecode(res.jwt);
                        const roleFromToken = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                        console.log("🚀 ~ authorize ~ roleFromToken:", roleFromToken);

                        // If the role is already a name, use it, otherwise map number to name
                        const roleName = ["Teacher", "Student", "Parent"].includes(roleFromToken || "")
                            ? roleFromToken
                            : getRoleName(roleFromToken || "");
                        console.log("🚀 ~ authorize ~ roleName:", roleName);

                        const email =
                            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
                            decoded.email ||
                            credentials.email;
                        console.log("🚀 ~ authorize ~ email:", email);

                        return {
                            id: credentials.email,
                            email: email,
                            name: email, // يمكنك إضافة اسم إذا متاح
                            role: roleName,
                            roleNumber: roleFromToken,
                            accessToken: res.jwt,
                            refreshToken: res.refreshToken,
                            accessTokenExpires: new Date(res.jwtExpireDate).getTime(),
                            refreshTokenExpires: new Date(res.refreshExpireDate).getTime(),
                        };
                    } catch (error) {
                        console.error("Error decoding JWT:", error);
                        return null;
                    }
                }


                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpires;
                token.refreshTokenExpires = user.refreshTokenExpires;
                token.role = user.role;
                token.roleNumber = user.roleNumber;
            }

            if (Date.now() < token.accessTokenExpires) return token;

            return await refreshAccessToken(token as AuthToken);
        },

        async session({ session, token }) {
            session.user = {
                ...session.user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                role: token.role,
                roleNumber: token.roleNumber,
            };
            return session;
        },
    },
});

async function refreshAccessToken(token: AuthToken): Promise<AuthToken> {
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
            refreshTokenExpires: new Date(data.data.refreshJWTModel.refreshExpireDate).getTime(),
        };
    } catch (error) {
        console.error("Refresh token error:", error);
        return { ...token, error: "RefreshTokenError" };
    }
}


export { handler as GET, handler as POST };
