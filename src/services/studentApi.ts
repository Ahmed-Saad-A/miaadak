import { ApiResponse, Levels, Subject } from "@/interfaces";
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

    // =========== Get all students ===========
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

    // =========== Levels ===========

    // Get All Grade Levels
    async getAllGradeLevels(): Promise<ApiResponse<Levels[]>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/GradeLevel/GetAllGradeLevels`,
            {
                method: "GET",
                headers: this.#getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch grade levels");
        }

        return (await response.json()) as ApiResponse<Levels[]>;
    }

    // Create Grade Level
    async createGradeLevel(name: string): Promise<ApiResponse<Levels>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/GradeLevel/CreateGradeLevel`,
            {
                method: "POST",
                headers: this.#getHeaders(),
                body: JSON.stringify({ name }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create grade level");
        }

        return (await response.json()) as ApiResponse<Levels>;
    }

    //  Update Grade Level
    async updateGradeLevel(id: number, name: string): Promise<ApiResponse<Levels>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/GradeLevel/UpdateGradeLevel`,
            {
                method: "PUT",
                headers: this.#getHeaders(),
                body: JSON.stringify({ id, name }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update grade level");
        }

        return (await response.json()) as ApiResponse<Levels>;
    }

    // Delete Grade Level
    async deleteGradeLevel(id: number): Promise<ApiResponse<null>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/GradeLevel/DeleteGradeLevel?id=${id}`,
            {
                method: "DELETE",
                headers: this.#getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete grade level");
        }

        return (await response.json()) as ApiResponse<null>;
    }
    // Get Grade Level By Id
    async getGradeLevelById(id: number): Promise<ApiResponse<Levels>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/GradeLevel/GetGradeLevelById`,
            {
                method: "GET",
                headers: this.#getHeaders(),
                body: JSON.stringify({ id }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch grade level");
        }

        return (await response.json()) as ApiResponse<Levels>;
    }

    // ========== Student Subjects ===========

    //  Get All Subjects 
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

    // Create Subject
    async createSubject(name: string): Promise<ApiResponse<Subject>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Subject/CreateSubject`,
            {
                method: "POST",
                headers: this.#getHeaders(),
                body: JSON.stringify({ name }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create subject");
        }

        return (await response.json()) as ApiResponse<Subject>;
    }

    //  Update Subject
    async updateSubject(id: number, name: string): Promise<ApiResponse<Subject>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Subject/UpdateSubject`,
            {
                method: "PUT",
                headers: this.#getHeaders(),
                body: JSON.stringify({ id, name }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update subject");
        }

        return (await response.json()) as ApiResponse<Subject>;
    }

    // Delete Subject
    async deleteSubject(id: number): Promise<ApiResponse<null>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Subject/DeleteSubject?id=${id}`,
            {
                method: "DELETE",
                headers: this.#getHeaders(),
            }
        );    
        if (!response.ok) {
            throw new Error("Failed to delete subject");
        }
        return (await response.json()) as ApiResponse<null>;
    }

    // Get Subject By Id
    async getSubjectById(id: number): Promise<ApiResponse<Subject>> {
        const response = await fetch(
            `${this.#baseUrl}api/v1/Subject/GetSubjectById`,
            {
                method: "GET",
                headers: this.#getHeaders(),
                body: JSON.stringify({ id }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch subject");
        }

        return (await response.json()) as ApiResponse<Subject>;
    }

}

export const studentApi = new StudentApi();