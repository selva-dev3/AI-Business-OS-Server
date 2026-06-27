declare class AppError extends Error {
    statusCode: number;
    error: string;
    isOperational: boolean;
    constructor(statusCode: number, error: string, message: string);
}
export default AppError;
//# sourceMappingURL=appError.d.ts.map