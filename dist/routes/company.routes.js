"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const upload_1 = require("../middleware/upload");
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const companyController = __importStar(require("../controllers/company.controller"));
const company_validator_1 = require("../validators/company.validator");
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', auth_1.authenticate, companyController.get);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/', auth_1.authenticate, (0, validate_1.validate)(company_validator_1.updateCompanySchema), (0, auditLogger_1.default)('company', 'UPDATE', 'company'), companyController.update);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/logo', auth_1.authenticate, upload_1.logoUpload, upload_1.handleUploadError, companyController.uploadLogo);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/settings', auth_1.authenticate, companyController.getSettings);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/settings', auth_1.authenticate, (0, validate_1.validate)(company_validator_1.updateSettingsSchema), companyController.updateSettings);
/**
 * @swagger
 * /company/branches:
 *   get:
 *     summary: List all branches
 *     tags: [Company]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of branches
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/branches', auth_1.authenticate, companyController.listBranches);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/branches', auth_1.authenticate, (0, validate_1.validate)(company_validator_1.createBranchSchema), (0, auditLogger_1.default)('company', 'CREATE', 'branch'), companyController.createBranch);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/branches/:id', auth_1.authenticate, (0, validate_1.validate)(company_validator_1.updateBranchSchema), companyController.updateBranch);
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/branches/:id', auth_1.authenticate, (0, auditLogger_1.default)('company', 'DELETE', 'branch'), companyController.deleteBranch);
exports.default = router;
//# sourceMappingURL=company.routes.js.map