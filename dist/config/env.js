"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const env = {
    nodeEnv: process.env['NODE_ENV'] || 'development',
    port: parseInt(process.env['PORT'] || '5000', 10),
    mongodbUri: process.env['MONGODB_URI'] || 'mongodb+srv://selvakumar152000_db_user:selva@cluster0.5rs7mwd.mongodb.net/?appName=Cluster0',
    jwt: {
        secret: process.env['JWT_SECRET'] || 'default-jwt-secret',
        refreshSecret: process.env['JWT_REFRESH_SECRET'] || 'default-refresh-secret',
        accessExpiresIn: process.env['JWT_ACCESS_EXPIRES_IN'] || '15m',
        refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d',
    },
    upload: {
        dir: process.env['UPLOAD_DIR'] || './uploads',
        maxFileSize: parseInt(process.env['MAX_FILE_SIZE'] || '52428800', 10),
    },
    cors: {
        origin: process.env['CORS_ORIGIN'] || '*',
    },
    rateLimit: {
        windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
        max: parseInt(process.env['RATE_LIMIT_MAX'] || '100', 10),
    },
    smtp: {
        host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
        port: parseInt(process.env['SMTP_PORT'] || '587', 10),
        secure: process.env['SMTP_SECURE'] === 'true',
        user: process.env['SMTP_USER'] || '',
        pass: process.env['SMTP_PASS'] || '',
        from: process.env['SMTP_FROM'] || 'AI Business OS <noreply@yourdomain.com>',
    },
};
exports.default = env;
//# sourceMappingURL=env.js.map