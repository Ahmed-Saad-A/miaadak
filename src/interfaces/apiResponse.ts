export interface ApiResponse<T> {
    statusCode: number;
    isSucceeded: boolean;
    message: string;
    errors: string | null;
    meta: null;
    data: T;
}
