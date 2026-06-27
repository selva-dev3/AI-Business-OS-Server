import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { logoUpload, handleUploadError } from '../middleware/upload';
import auditLog from '../middleware/auditLogger';
import * as companyController from '../controllers/company.controller';
import {
  updateCompanySchema,
  updateSettingsSchema,
  createBranchSchema,
  updateBranchSchema,
} from '../validators/company.validator';

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company management
 */

/**
 * @swagger
 * /company:
 *   get:
 *     summary: Get current company details
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Company details
 */
router.get('/', authenticate, companyController.get);

/**
 * @swagger
 * /company:
 *   patch:
 *     summary: Update company details
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Company updated
 */
router.patch('/', authenticate, validate(updateCompanySchema), auditLog('company', 'UPDATE', 'company'), companyController.update);

/**
 * @swagger
 * /company/logo:
 *   post:
 *     summary: Upload company logo
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Logo uploaded
 */
router.post('/logo', authenticate, logoUpload, handleUploadError, companyController.uploadLogo);

/**
 * @swagger
 * /company/settings:
 *   get:
 *     summary: Get company settings
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Company settings
 */
router.get('/settings', authenticate, companyController.getSettings);

/**
 * @swagger
 * /company/settings:
 *   patch:
 *     summary: Update company settings
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.patch('/settings', authenticate, validate(updateSettingsSchema), companyController.updateSettings);

/**
 * @swagger
 * @swagger
 * /company/branches:
 *   get:
 *     summary: List all branches
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of branches
 */
router.get('/branches', authenticate, companyController.listBranches);

/**
 * @swagger
 * /company/branches:
 *   post:
 *     summary: Create a branch
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Branch created
 */
router.post('/branches', authenticate, validate(createBranchSchema), auditLog('company', 'CREATE', 'branch'), companyController.createBranch);

/**
 * @swagger
 * /company/branches/{id}:
 *   patch:
 *     summary: Update a branch
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Branch updated
 */
router.patch('/branches/:id', authenticate, validate(updateBranchSchema), companyController.updateBranch);

/**
 * @swagger
 * /company/branches/{id}:
 *   delete:
 *     summary: Delete a branch
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Branch deleted
 */
router.delete('/branches/:id', authenticate, auditLog('company', 'DELETE', 'branch'), companyController.deleteBranch);

export default router;
