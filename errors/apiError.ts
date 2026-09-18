export type ApiErrorOptions = {
    code: string;
    details?: unknown;
    message: string;
    status: number;
};

export class ApiError extends Error {
    readonly code: string;
    readonly details?: unknown;
    readonly status: number;

    constructor(options: ApiErrorOptions) {
        super(options.message);
        this.name = "ApiError";
        this.code = options.code;
        this.details = options.details;
        this.status = options.status;
    }
}
