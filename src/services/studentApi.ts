import { ApiResponse } from "@/interfaces";
import { Student } from "@/interfaces";


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


class StudentApi {
    #baseUrl: string = "";

    constructor() {
        this.#baseUrl = baseUrl ?? "";
    }

    #getHeaders() {
        return {
            "content-type": "application/json"
        };
    }

        async getAllStudents(): Promise<ApiResponse<Student[]>> {
            const response = await fetch(
                `${this.#baseUrl}api/v1/Student/GetAllStudents`,
                {
                    method: "GET",
                    headers: this.#getHeaders(),
                }
            );
    
            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }
    
            return (await response.json()) as ApiResponse<Student[]>;
        }

}

export const studentApi = new StudentApi();