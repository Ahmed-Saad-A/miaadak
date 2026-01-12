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

    // =========== Register Teacher ===========
    async registerTeacher(data: UserRegistration): Promise<RegisterResponse> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/Register/Teacher`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to register user");
        }

        return (await response.json()) as RegisterResponse;
    }

    // =========== Register Student ===========
    async registerStudent(data: UserRegistration): Promise<RegisterResponse> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/Register/Student`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to register user");
        }

        return (await response.json()) as RegisterResponse;
    }

    // =========== Register Parent ===========
    async registerParent(data: UserRegistration): Promise<RegisterResponse> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/Register/Parent`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to register user");
        }

        return (await response.json()) as RegisterResponse;
    }

    // =========== Register Assistant ===========
    async registerAssistant(data: UserRegistration): Promise<RegisterResponse> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/Register/Assistant`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to register user");
        }

        return (await response.json()) as RegisterResponse;
    }

    // =========== Register User (routes based on userRole) ===========
    async registerUser(data: UserRegistration): Promise<RegisterResponse> {
        switch (data.userRole) {
            case 1: // TEACHER
                return this.registerTeacher(data);
            case 2: // STUDENT
                return this.registerStudent(data);
            case 3: // PARENT
                return this.registerParent(data);
            case 4: // ASSISTANT
                return this.registerAssistant(data);
            default:
                throw new Error("Invalid user role");
        }
    }

    // =========== Login User ===========
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

    // =========== Refresh Access Token ===========
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

    // =========== Send Verification Code ===========
    async sendVerificationCode(email: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/SendVerifyCode`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify({ email }),
        });
        return (await response.json()) as ApiResponse<null>;
    }

    // =========== Verify Code ===========
    async verifyCode(email: string, code: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/VerifyCode`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify({ email, code }),
        });
        return (await response.json()) as ApiResponse<null>;
    }

    // =========== Reset Password ===========
    async resetPassword(email: string, password: string, confirmPassword: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/ResetPassword`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify({ email, password, confirmPassword }),
        });
        return (await response.json()) as ApiResponse<null>;
    }

    // =========== Resend Confirmation Email ===========
    async resendConfirmationEmail(email: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${this.#baseUrl}api/v1/Account/ResendConfirmation`, {
            method: "POST",
            headers: this.#getHeaders(),
            body: JSON.stringify({ email }),
        });
        return (await response.json()) as ApiResponse<null>;
    }

}


export const servicesApi = new ServicesApi();
