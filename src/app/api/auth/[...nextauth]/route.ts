import { servicesApi } from "@/services/api";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AuthToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires?: number;
    error?: string;
}

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

                if (res.success) {
                    return {
                        id: credentials.email,
                        email: credentials.email,
                        accessToken: res.jwt,
                        refreshToken: res.refreshToken,
                        accessTokenExpires: new Date(res.jwtExpireDate).getTime(),
                        refreshTokenExpires: new Date(res.refreshExpireDate).getTime(),
                    };
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
            }

            if (Date.now() < token.accessTokenExpires) return token;

            return await refreshAccessToken(token as AuthToken);
        },

        async session({ session, token }) {
            session.user = {
                ...session.user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
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
