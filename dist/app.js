"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./config/logger"));
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = __importDefault(require("./config/swagger"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// ================================
// Ensure upload directories exist
// ================================
const uploadDirs = [
    'avatars',
    'logos',
    'documents',
    'receipts',
    'csv',
    'resumes',
];
uploadDirs.forEach((dir) => {
    const fullPath = path_1.default.join(env_1.default.upload.dir, dir);
    if (!fs_1.default.existsSync(fullPath)) {
        fs_1.default.mkdirSync(fullPath, { recursive: true });
    }
});
// ================================
// Security
// ================================
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: 'cross-origin',
    },
}));
// ================================
// CORS
// ================================
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];
if (env_1.default.cors.origin && env_1.default.cors.origin !== '*') {
    allowedOrigins.push(env_1.default.cors.origin);
}
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log('Blocked Origin:', origin);
        return callback(new Error(`CORS Error: ${origin} is not allowed`));
    },
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
    ],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
    ],
    exposedHeaders: [
        'Authorization',
    ],
}));
// Handle OPTIONS request
app.options('*', (0, cors_1.default)());
// ================================
// Rate Limiter
// ================================
const limiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.default.rateLimit.windowMs,
    max: env_1.default.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        error: 'TOO_MANY_REQUESTS',
        message: 'Too many requests. Please try again later.',
    },
});
app.use('/api', limiter);
// ================================
// Body Parser
// ================================
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10mb',
}));
// ================================
// Logger
// ================================
if (env_1.default.nodeEnv !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => logger_1.default.info(message.trim()),
        },
    }));
}
// ================================
// Swagger
// ================================
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    customCss: '.swagger-ui .topbar { display:none }',
    customSiteTitle: 'AI Business OS API',
}));
// ================================
// Static Uploads
// ================================
app.use('/uploads', express_1.default.static(path_1.default.join(env_1.default.upload.dir)));
// ================================
// Routes
// ================================
app.use('/api/v1', routes_1.default);
// ================================
// Root
// ================================
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'AI Business OS API Running',
        version: 'v1',
    });
});
// ================================
// Health
// ================================
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        data: {
            status: 'OK',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        },
    });
});
// ================================
// Error Handler
// ================================
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// ================================
// Start Server
// ================================
async function startServer() {
    try {
        await (0, db_1.default)();
        app.listen(env_1.default.port, () => {
            logger_1.default.info(`Server running on http://localhost:${env_1.default.port}`);
            logger_1.default.info(`Swagger: http://localhost:${env_1.default.port}/api-docs`);
            logger_1.default.info(`Health: http://localhost:${env_1.default.port}/health`);
        });
    }
    catch (error) {
        logger_1.default.error(error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map