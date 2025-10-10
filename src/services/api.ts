import { UserRegistration, ApiResponse, AuthToken } from '@/interfaces';

export interface RegisterResponse extends ApiResponse<string> { endpoint?: "register" }

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


class ServicesApi {
    #baseUrl: string = "";

    constructor() {
        this.#baseUrl = baseUrl ?? "";
    }

    #getHeaders() {
        return {
            "content-type": "application/json"
        };
    }

    async registerUser(data: UserRegistration): Promise<RegisterResponse> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/Register`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to register user");
        }

        return (await response.json()) as RegisterResponse;
    }

    async loginUser(email: string, password: string) {
        const res = await fetch(`${baseUrl}api/v1/Account/Login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("فشل تسجيل الدخول");

        const data = await res.json();

        return {
            success: data.isSucceeded,
            message: data.message,
            jwt: data.data.jwtModel.jwt,
            jwtExpireDate: data.data.jwtModel.jwtExpireDate,
            refreshToken: data.data.refreshJWTModel.refreshJWT,
            refreshExpireDate: data.data.refreshJWTModel.refreshJWTExpireDate,
        };
    }

    async refreshAccessToken(token: AuthToken): Promise<AuthToken> {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/Account/RefreshToken`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jwt: token.accessToken,
                    refreshJwt: token.refreshToken,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.isSucceeded || !data.data) {
                console.error("Refresh token failed:", data);
                throw new Error("Refresh token failed");
            }

            return {
                ...token,
                accessToken: data.data.jwtModel.jwt,
                accessTokenExpires: new Date(data.data.jwtModel.jwtExpireDate).getTime(),
                refreshToken: data.data.refreshJWTModel.refreshJWT ?? token.refreshToken,
            };
        } catch (error) {
            console.error("Refresh token error:", error);
            return { ...token, error: "RefreshTokenError" };
        }
    }

}


export const servicesApi = new ServicesApi();
