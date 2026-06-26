const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project and Task Management
 */


const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const auditLog = require('../middleware/auditLogger');
const projectController = require('../controllers/project.controller');
const {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  logTimeSchema,
  addCommentSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createTimesheetSchema,
} = require('../validators/project.validator');

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all Projects records
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, projectController.list);
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new Projects record
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validate(createProjectSchema), auditLog('project', 'CREATE', 'project'), projectController.create);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a specific Projects record by ID
 *     tags: [Projects]
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
router.get('/:id', authenticate, projectController.getById);
/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update an existing Projects record by ID
 *     tags: [Projects]
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
router.patch('/:id', authenticate, validate(updateProjectSchema), auditLog('project', 'UPDATE', 'project'), projectController.update);
/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a Projects record by ID
 *     tags: [Projects]
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
router.delete('/:id', authenticate, auditLog('project', 'DELETE', 'project'), projectController.remove);

/**
 * @swagger
 * /projects/{id}/members:
 *   post:
 *     summary: Create Members
 *     tags: [Projects]
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
router.post('/:id/members', authenticate, validate(addMemberSchema), auditLog('project', 'CREATE', 'project-member'), projectController.addMember);
/**
 * @swagger
 * /projects/{id}/members/{userId}:
 *   delete:
 *     summary: Delete Members
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id parameter
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The userId parameter
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/members/:userId', authenticate, auditLog('project', 'DELETE', 'project-member'), projectController.removeMember);

/**
 * @swagger
 * /projects/{id}/tasks:
 *   get:
 *     summary: Get Tasks
 *     tags: [Projects]
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
router.get('/:id/tasks', authenticate, projectController.listTasks);
/**
 * @swagger
 * /projects/{id}/tasks:
 *   post:
 *     summary: Create Tasks
 *     tags: [Projects]
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
router.post('/:id/tasks', authenticate, validate(createTaskSchema), auditLog('project', 'CREATE', 'task'), projectController.createTask);

/**
 * @swagger
 * /projects/tasks/{id}:
 *   get:
 *     summary: Get Tasks
 *     tags: [Projects]
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
router.get('/tasks/:id', authenticate, projectController.getTaskById);
/**
 * @swagger
 * /projects/tasks/{id}:
 *   patch:
 *     summary: Update Tasks
 *     tags: [Projects]
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
router.patch('/tasks/:id', authenticate, validate(updateTaskSchema), auditLog('project', 'UPDATE', 'task'), projectController.updateTask);
/**
 * @swagger
 * /projects/tasks/{id}:
 *   delete:
 *     summary: Delete Tasks
 *     tags: [Projects]
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
router.delete('/tasks/:id', authenticate, auditLog('project', 'DELETE', 'task'), projectController.removeTask);

/**
 * @swagger
 * /projects/tasks/{id}/move:
 *   patch:
 *     summary: Update Tasks Move
 *     tags: [Projects]
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
router.patch('/tasks/:id/move', authenticate, validate(moveTaskSchema), projectController.moveTask);
/**
 * @swagger
 * /projects/tasks/{id}/time:
 *   post:
 *     summary: Create Tasks Time
 *     tags: [Projects]
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
router.post('/tasks/:id/time', authenticate, validate(logTimeSchema), projectController.logTime);
/**
 * @swagger
 * /projects/tasks/{id}/comment:
 *   post:
 *     summary: Create Tasks Comment
 *     tags: [Projects]
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
router.post('/tasks/:id/comment', authenticate, validate(addCommentSchema), auditLog('project', 'CREATE', 'task-comment'), projectController.addComment);
/**
 * @swagger
 * /projects/tasks/{id}/comments:
 *   get:
 *     summary: Get Tasks Comments
 *     tags: [Projects]
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
router.get('/tasks/:id/comments', authenticate, projectController.getComments);

/**
 * @swagger
 * /projects/{id}/milestones:
 *   get:
 *     summary: Get Milestones
 *     tags: [Projects]
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
router.get('/:id/milestones', authenticate, projectController.listMilestones);
/**
 * @swagger
 * /projects/{id}/milestones:
 *   post:
 *     summary: Create Milestones
 *     tags: [Projects]
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
router.post('/:id/milestones', authenticate, validate(createMilestoneSchema), auditLog('project', 'CREATE', 'milestone'), projectController.createMilestone);

/**
 * @swagger
 * /projects/milestones/{id}:
 *   get:
 *     summary: Get Milestones
 *     tags: [Projects]
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
router.get('/milestones/:id', authenticate, projectController.getMilestone);
/**
 * @swagger
 * /projects/milestones/{id}:
 *   patch:
 *     summary: Update Milestones
 *     tags: [Projects]
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
router.patch('/milestones/:id', authenticate, validate(updateMilestoneSchema), auditLog('project', 'UPDATE', 'milestone'), projectController.updateMilestone);
/**
 * @swagger
 * /projects/milestones/{id}:
 *   delete:
 *     summary: Delete Milestones
 *     tags: [Projects]
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
router.delete('/milestones/:id', authenticate, auditLog('project', 'DELETE', 'milestone'), projectController.removeMilestone);

/**
 * @swagger
 * /projects/timesheets:
 *   get:
 *     summary: Get Timesheets
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/timesheets', authenticate, projectController.listTimesheets);
/**
 * @swagger
 * /projects/timesheets:
 *   post:
 *     summary: Create Timesheets
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Invalid input or bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/timesheets', authenticate, validate(createTimesheetSchema), projectController.createTimesheet);
/**
 * @swagger
 * /projects/{id}/timesheets:
 *   get:
 *     summary: Get Timesheets
 *     tags: [Projects]
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
router.get('/:id/timesheets', authenticate, projectController.getProjectTimesheets);

/**
 * @swagger
 * /projects/{id}/reports/summary:
 *   get:
 *     summary: Get summary of Reports Summary
 *     tags: [Projects]
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
router.get('/:id/reports/summary', authenticate, projectController.getSummary);

module.exports = router;
