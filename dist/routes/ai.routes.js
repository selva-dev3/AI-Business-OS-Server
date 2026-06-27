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
/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Artificial Intelligence Features and Integrations
 */
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const upload_1 = require("../middleware/upload");
const aiController = __importStar(require("../controllers/ai.controller"));
const ai_validator_1 = require("../validators/ai.validator");
/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Create Chat
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/chat', auth_1.authenticate, (0, validate_1.validate)(ai_validator_1.chatSchema), aiController.chat);
/**
 * @swagger
 * /ai/insights:
 *   post:
 *     summary: Create Insights
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/insights', auth_1.authenticate, (0, validate_1.validate)(ai_validator_1.aiInsightsSchema), aiController.getInsights);
/**
 * @swagger
 * /ai/summarize:
 *   post:
 *     summary: Create Summarize
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/summarize', auth_1.authenticate, (0, validate_1.validate)(ai_validator_1.summarizeSchema), aiController.summarize);
/**
 * @swagger
 * /ai/generate-email:
 *   post:
 *     summary: Create Generate-email
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/generate-email', auth_1.authenticate, (0, validate_1.validate)(ai_validator_1.generateEmailSchema), aiController.generateEmail);
/**
 * @swagger
 * /ai/extract-document:
 *   post:
 *     summary: Create Extract-document
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/extract-document', auth_1.authenticate, upload_1.resumeUpload, upload_1.handleUploadError, aiController.extractDocument);
/**
 * @swagger
 * /ai/forecast:
 *   post:
 *     summary: Create Forecast
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/forecast', auth_1.authenticate, (0, validate_1.validate)(ai_validator_1.forecastSchema), aiController.forecast);
/**
 * @swagger
 * /ai/parse-resume:
 *   post:
 *     summary: Create Parse-resume
 *     tags: [AI]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/parse-resume', auth_1.authenticate, upload_1.resumeUpload, upload_1.handleUploadError, aiController.parseResume);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map