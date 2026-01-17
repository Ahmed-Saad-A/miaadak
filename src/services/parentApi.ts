

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

}

export const parentApi = new ParentApi();