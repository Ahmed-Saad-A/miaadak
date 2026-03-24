import { ApiResponse } from "@/interfaces";
import { Parent } from "@/interfaces";


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


class ParentApi {
    #baseUrl: string = "";

    constructor() {
        this.#baseUrl = baseUrl ?? "";
    }

    #getHeaders() {
        return {
            "content-type": "application/json"
        };
    }

        async getAllParent(): Promise<ApiResponse<Parent[]>> {
                const response = await fetch(
                    `${this.#baseUrl}api/v1/Assistant/GetAllAssistants`,
                    {
                        method: "GET",
                        headers: this.#getHeaders(),
                    }
                );
        
                if (!response.ok) {
                    throw new Error("Failed to fetch assistants");
                }
        
                return (await response.json()) as ApiResponse<Parent[]>;
            }

}

export const parentApi = new ParentApi();