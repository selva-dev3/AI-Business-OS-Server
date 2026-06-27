import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import env from '../config/env';
import ApiResponse from '../utils/apiResponse';

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createUploader = (subDir: string, allowedMimes: string[], maxSize?: number) => {
  const uploadDir = path.join(env.upload.dir, subDir);
  ensureDir(uploadDir);

  const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, uploadDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(', ')}`));
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

const handleUploadError = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      ApiResponse.error(res, 400, 'BAD_REQUEST', 'File too large');
      return;
    }
    ApiResponse.error(res, 400, 'BAD_REQUEST', err.message);
    return;
  }
  if (err) {
    ApiResponse.error(res, 400, 'BAD_REQUEST', err.message);
    return;
  }
  next();
};

export {
  avatarUpload,
  logoUpload,
  documentUpload,
  receiptUpload,
  csvUpload,
  resumeUpload,
  handleUploadError,
};
