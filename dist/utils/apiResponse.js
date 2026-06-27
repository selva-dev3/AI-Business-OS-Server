"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class ApiResponse {
    static success(res, data, statusCode = 200) {
        const body = {
            success: true,
            data,
            timestamp: new Date().toISOString(),
            requestId: (0, uuid_1.v4)(),
        };
        res.status(statusCode).json(body);
    }
    static paginated(res, data, meta) {
        const body = {
            success: true,
            data: { data, meta },
            timestamp: new Date().toISOString(),
            requestId: (0, uuid_1.v4)(),
        };
        res.status(200).json(body);
    }
    static created(res, data) {
        this.success(res, data, 201);
    }
    static error(res, statusCode, error, message, path) {
        const body = {
            success: false,
            statusCode,
            error,
            message,
            path: path || (res.req?.originalUrl ?? undefined),
            timestamp: new Date().toISOString(),
            requestId: (0, uuid_1.v4)(),
        };
        res.status(statusCode).json(body);
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=apiResponse.js.map