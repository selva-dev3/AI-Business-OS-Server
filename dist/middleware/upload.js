"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.resumeUpload = exports.csvUpload = exports.receiptUpload = exports.documentUpload = exports.logoUpload = exports.avatarUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const env_1 = __importDefault(require("../config/env"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const ensureDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
const createUploader = (subDir, allowedMimes, maxSize) => {
    const uploadDir = path_1.default.join(env_1.default.upload.dir, subDir);
    ensureDir(uploadDir);
    const storage = multer_1.default.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${(0, uuid_1.v4)()}${ext}`);
        },
    });
    const fileFilter = (_req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`));
        }
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: maxSize || env_1.default.upload.maxFileSize },
    });
};
const avatarUpload = createUploader('avatars', ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 5 * 1024 * 1024).single('file');
exports.avatarUpload = avatarUpload;
const logoUpload = createUploader('logos', ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 5 * 1024 * 1024).single('file');
exports.logoUpload = logoUpload;
const documentUpload = createUploader('documents', ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'], 50 * 1024 * 1024).single('file');
exports.documentUpload = documentUpload;
const receiptUpload = createUploader('receipts', ['image/jpeg', 'image/png', 'application/pdf'], 10 * 1024 * 1024).single('file');
exports.receiptUpload = receiptUpload;
const csvUpload = createUploader('csv', ['text/csv', 'application/vnd.ms-excel'], 10 * 1024 * 1024).single('file');
exports.csvUpload = csvUpload;
const resumeUpload = createUploader('resumes', ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 10 * 1024 * 1024).single('file');
exports.resumeUpload = resumeUpload;
const handleUploadError = (err, _req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            apiResponse_1.default.error(res, 400, 'BAD_REQUEST', 'File too large');
            return;
        }
        apiResponse_1.default.error(res, 400, 'BAD_REQUEST', err.message);
        return;
    }
    if (err) {
        apiResponse_1.default.error(res, 400, 'BAD_REQUEST', err.message);
        return;
    }
    next();
};
exports.handleUploadError = handleUploadError;
//# sourceMappingURL=upload.js.map