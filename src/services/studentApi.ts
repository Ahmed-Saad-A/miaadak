

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

}

export const studentApi = new StudentApi();