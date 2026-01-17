

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

}

export const assistantApi = new AssistantApi();