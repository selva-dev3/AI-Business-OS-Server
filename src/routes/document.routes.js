const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document Management and Storage
 */


const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { documentUpload, handleUploadError } = require('../middleware/upload');
const auditLog = require('../middleware/auditLogger');
const documentController = require('../controllers/document.controller');
const {
  createFolderSchema,
  updateFolderSchema,
  updateDocumentSchema,
  shareDocumentSchema,
} = require('../validators/document.validator');

/**
 * @swagger
 * /documents/folders:
 *   get:
 *     summary: Get Folders
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/folders', authenticate, documentController.listRoot);
/**
 * @swagger
 * /documents/folders:
 *   post:
 *     summary: Create Folders
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/folders', authenticate, validate(createFolderSchema), auditLog('document', 'CREATE', 'folder'), documentController.createFolder);
/**
 * @swagger
 * /documents/folders/{id}:
 *   get:
 *     summary: Get Folders
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/folders/:id', authenticate, documentController.getFolderById);
/**
 * @swagger
 * /documents/folders/{id}:
 *   patch:
 *     summary: Update Folders
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/folders/:id', authenticate, validate(updateFolderSchema), documentController.updateFolder);
/**
 * @swagger
 * /documents/folders/{id}:
 *   delete:
 *     summary: Delete Folders
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/folders/:id', authenticate, auditLog('document', 'DELETE', 'folder'), documentController.removeFolder);

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: List all Documents records
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, documentController.list);
/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Create a new Documents record
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, documentUpload, handleUploadError, documentController.create);
/**
 * @swagger
 * /documents/search:
 *   get:
 *     summary: Get Search
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticate, documentController.search);
/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get a specific Documents record by ID
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, documentController.getById);
/**
 * @swagger
 * /documents/{id}:
 *   patch:
 *     summary: Update an existing Documents record by ID
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', authenticate, validate(updateDocumentSchema), auditLog('document', 'UPDATE', 'document'), documentController.update);
/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Delete a Documents record by ID
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, auditLog('document', 'DELETE', 'document'), documentController.remove);
/**
 * @swagger
 * /documents/{id}/download:
 *   get:
 *     summary: Get Download
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/download', authenticate, documentController.download);
/**
 * @swagger
 * /documents/{id}/share:
 *   post:
 *     summary: Create Share
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/share', authenticate, validate(shareDocumentSchema), documentController.share);
/**
 * @swagger
 * /documents/{id}/versions:
 *   get:
 *     summary: Get Versions
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/versions', authenticate, documentController.getVersions);
/**
 * @swagger
 * /documents/{id}/restore/{version}:
 *   post:
 *     summary: Create Restore
 *     tags: [Documents]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: string
 *         description: The version parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/restore/:version', authenticate, documentController.restoreVersion);

module.exports = router;
