const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: System Notifications and Preferences
 */


const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notification.controller');

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List all Notifications records
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, notificationController.list);
/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Update Read-all
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Update Read
 *     tags: [Notifications]
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
router.patch('/:id/read', authenticate, notificationController.markAsRead);
/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a Notifications record by ID
 *     tags: [Notifications]
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
router.delete('/:id', authenticate, notificationController.remove);
/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get Unread-count
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

module.exports = router;
