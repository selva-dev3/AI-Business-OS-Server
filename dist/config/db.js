"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const env_1 = __importDefault(require("./env"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.default.mongodbUri);
        logger_1.default.info(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_1.default.error('MongoDB connection error:', error);
        process.exit(1);
    }
    mongoose_1.default.connection.on('error', (err) => {
        logger_1.default.error('MongoDB error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        logger_1.default.warn('MongoDB disconnected');
    });
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map