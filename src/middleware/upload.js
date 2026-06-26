const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const fs = require('fs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createUploader = (subDir, allowedMimes, maxSize) => {
  const uploadDir = path.join(env.upload.dir, subDir);
  ensureDir(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize || env.upload.maxFileSize },
  });
};

const avatarUpload = createUploader(
  'avatars',
  ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  5 * 1024 * 1024
).single('file');

const logoUpload = createUploader(
  'logos',
  ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  5 * 1024 * 1024
).single('file');

const documentUpload = createUploader(
  'documents',
  ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'],
  50 * 1024 * 1024
).single('file');

const receiptUpload = createUploader(
  'receipts',
  ['image/jpeg', 'image/png', 'application/pdf'],
  10 * 1024 * 1024
).single('file');

const csvUpload = createUploader(
  'csv',
  ['text/csv', 'application/vnd.ms-excel'],
  10 * 1024 * 1024
).single('file');

const resumeUpload = createUploader(
  'resumes',
  ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  10 * 1024 * 1024
).single('file');

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.error(res, 400, 'BAD_REQUEST', 'File too large');
    }
    return ApiResponse.error(res, 400, 'BAD_REQUEST', err.message);
  }
  if (err) {
    return ApiResponse.error(res, 400, 'BAD_REQUEST', err.message);
  }
  next();
};

module.exports = {
  avatarUpload,
  logoUpload,
  documentUpload,
  receiptUpload,
  csvUpload,
  resumeUpload,
  handleUploadError,
};
