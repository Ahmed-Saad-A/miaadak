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

    // ========== Package ===========

    //  Get All Packages 
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

    // Update Package
    async updatePackage(id: number, name: number, monthlyPrice: number, description: string, maxSessionsPerMonth: number, maxStudentsPerSession: number, maxAssistantsPerTeacher: number): Promise<ApiResponse<Package>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Package/UpdatePackage`,
            {
                method: "PUT",
                headers: this.#getHeaders(),
                body: JSON.stringify({ id, name, monthlyPrice, description, maxSessionsPerMonth, maxStudentsPerSession, maxAssistantsPerTeacher }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update package");
        }

        return (await response.json()) as ApiResponse<Package>;
    }

    //  Get Package By Id 
    async getPackageById(id: number): Promise<ApiResponse<Package>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Package/GetPackageById?id=${id}`,
            {
                method: "GET",
                headers: this.#getHeaders(),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch package");
        }
        return (await response.json()) as ApiResponse<Package>;
    }

}

export const teacherApi = new TeacherApi();