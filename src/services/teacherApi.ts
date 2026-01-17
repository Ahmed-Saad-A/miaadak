import { ApiResponse, Package } from "@/interfaces";


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
}

export const teacherApi = new TeacherApi();