import { UserRegistration, ApiResponse, AuthToken, Subject, Levels, TeacherFormData, StudentFormData, ParentFormData } from '@/interfaces';
import { AssistantFormData } from '@/interfaces/assistant';

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
    async registerTeacher(data: TeacherFormData): Promise<RegisterResponse> {
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

    // =========== Get All Subjects ===========
    async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Subject/GetAllSubjects`,
            {
                method: "GET",
                headers: this.#getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch subjects");
        }

        return (await response.json()) as ApiResponse<Subject[]>;
    }

    // =========== Register Student ===========
    async registerStudent(data: StudentFormData): Promise<RegisterResponse> {
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

    // =========== Get All Levels ===========
    async getAllLevels(): Promise<ApiResponse<Levels[]>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/GradeLevel/GetAllGradeLevels`,
            {
                method: "GET",
                headers: this.#getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch levels");
        }

        return (await response.json()) as ApiResponse<Levels[]>;
    }

    // =========== Register Parent ===========
    async registerParent(data: ParentFormData): Promise<RegisterResponse> {
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
    async registerAssistant(data: AssistantFormData): Promise<RegisterResponse> {
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
