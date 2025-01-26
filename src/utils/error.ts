export class MyError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 500;
    }
}

export function handleError(err: MyError, statusCode: number): MyError {
    err.statusCode = statusCode
    return err
}