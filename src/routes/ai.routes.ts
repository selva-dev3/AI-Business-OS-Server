import express from 'express';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Artificial Intelligence Features and Integrations
 */


import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { resumeUpload, handleUploadError } from '../middleware/upload';
import * as aiController from '../controllers/ai.controller';
import {
  chatSchema,
  aiInsightsSchema,
  summarizeSchema,
  generateEmailSchema,
  forecastSchema,
} from '../validators/ai.validator';

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
router.post('/chat', authenticate, validate(chatSchema), aiController.chat);
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
router.post('/insights', authenticate, validate(aiInsightsSchema), aiController.getInsights);
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
router.post('/summarize', authenticate, validate(summarizeSchema), aiController.summarize);
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
router.post('/generate-email', authenticate, validate(generateEmailSchema), aiController.generateEmail);
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
router.post('/extract-document', authenticate, resumeUpload, handleUploadError, aiController.extractDocument);
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
router.post('/forecast', authenticate, validate(forecastSchema), aiController.forecast);
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
router.post('/parse-resume', authenticate, resumeUpload, handleUploadError, aiController.parseResume);

export default router;
