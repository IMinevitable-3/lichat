export interface Response {
    statusCode: number;
    message: string | null;
    data: any;
}

export function createResponse(statusCode: number, message: string | null, data: any): Response {
    return new class implements Response {
        statusCode = statusCode;
        message = message;
        data = data;
    }
}