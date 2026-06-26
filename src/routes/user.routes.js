const express = require('express');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management and Profiles
 */


const { authenticate } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const auditLog = require('../middleware/auditLogger');
const { avatarUpload, handleUploadError } = require('../middleware/upload');
const {
  inviteUserSchema,
  updateUserSchema,
  changeRoleSchema,
  resetUserPasswordSchema,
  updateProfileSchema,
} = require('../validators/user.validator');
const {
  list,
  invite,
  getById,
  update,
  remove,
  changeRole,
  resetPassword,
  updateProfile,
  uploadAvatar,
} = require('../controllers/user.controller');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all Users records
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, checkPermission('users', 'read'), list);
/**
 * @swagger
 * /users/invite:
 *   post:
 *     summary: Create Invite
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/invite', authenticate, checkPermission('users', 'create'), validate(inviteUserSchema), auditLog('users', 'CREATE', 'user'), invite);
/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update Me
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/me', authenticate, validate(updateProfileSchema), updateProfile);
/**
 * @swagger
 * /users/me/avatar:
 *   post:
 *     summary: Create Me Avatar
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/me/avatar', authenticate, avatarUpload, handleUploadError, uploadAvatar);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific Users record by ID
 *     tags: [Users]
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
router.get('/:id', authenticate, checkPermission('users', 'read'), getById);
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update an existing Users record by ID
 *     tags: [Users]
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
router.patch('/:id', authenticate, checkPermission('users', 'update'), validate(updateUserSchema), auditLog('users', 'UPDATE', 'user'), update);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a Users record by ID
 *     tags: [Users]
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
router.delete('/:id', authenticate, checkPermission('users', 'delete'), auditLog('users', 'DELETE', 'user'), remove);
/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Update Role
 *     tags: [Users]
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
router.patch('/:id/role', authenticate, checkPermission('users', 'update'), validate(changeRoleSchema), changeRole);
/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Create Reset-password
 *     tags: [Users]
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
router.post('/:id/reset-password', authenticate, checkPermission('users', 'update'), validate(resetUserPasswordSchema), resetPassword);

module.exports = router;
