import { ApiResponse, Package, Teacher } from "@/interfaces";


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


class TeacherApi {
    #baseUrl: string = "";

    constructor() {
        this.#baseUrl = baseUrl ?? "";
    }

    #getHeaders() {
        return {
            "content-type": "application/json"
        };
    }

    // =========== Get all packages ===========
    async getAllPackages(): Promise<ApiResponse<Package[]>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Package/GetAllPackages`,
            {
                method: "GET",
                headers: this.#getHeaders(),
            }
        );
        return (await response.json()) as ApiResponse<Package[]>;
    }

        // =========== Get All Teachers ===========
        async getAllTeachers(): Promise<ApiResponse<Teacher[]>> {
            const response = await fetch(
                `${this.#baseUrl}api/v1/Teacher/GetAllTeachers`,
                {
                    method: "GET",
                    headers: this.#getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch teachers");
            }

            return (await response.json()) as ApiResponse<Teacher[]>;
        }
}

export const teacherApi = new TeacherApi();