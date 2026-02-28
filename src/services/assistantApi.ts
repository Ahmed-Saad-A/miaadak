import { ApiResponse } from "@/interfaces";
import { Assistant } from "@/interfaces/assistant";


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


class AssistantApi {
    #baseUrl: string = "";

    constructor() {
        this.#baseUrl = baseUrl ?? "";
    }

    #getHeaders() {
        return {
            "content-type": "application/json"
        };
    }

    async getAllAssistants(): Promise<ApiResponse<Assistant[]>> {
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
    
            return (await response.json()) as ApiResponse<Assistant[]>;
        }

}

export const assistantApi = new AssistantApi();