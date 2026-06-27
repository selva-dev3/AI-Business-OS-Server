import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import auditLog from '../middleware/auditLogger';
import * as projectController from '../controllers/project.controller';
import {
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
} from '../validators/project.validator';

router.use(authenticate);

// Projects
router.get('/', projectController.list);
router.post('/', validate(createProjectSchema), auditLog('project', 'CREATE', 'project'), projectController.create);
router.get('/:id', projectController.getById);
router.patch('/:id', validate(updateProjectSchema), auditLog('project', 'UPDATE', 'project'), projectController.update);
router.delete('/:id', auditLog('project', 'DELETE', 'project'), projectController.remove);
router.get('/:id/summary', projectController.getSummary);

// Members
router.post('/:id/members', validate(addMemberSchema), auditLog('project', 'ADD_MEMBER', 'project'), projectController.addMember);
router.delete('/:id/members/:userId', auditLog('project', 'REMOVE_MEMBER', 'project'), projectController.removeMember);

// Tasks
router.get('/:id/tasks', projectController.listTasks);
router.post('/:id/tasks', validate(createTaskSchema), auditLog('project', 'CREATE', 'task'), projectController.createTask);
router.get('/:id/tasks/:taskId', projectController.getTaskById);
router.patch('/:id/tasks/:taskId', validate(updateTaskSchema), projectController.updateTask);
router.delete('/:id/tasks/:taskId', auditLog('project', 'DELETE', 'task'), projectController.removeTask);
router.patch('/:id/tasks/:taskId/move', validate(moveTaskSchema), projectController.moveTask);

// Time logging
router.post('/:id/tasks/:taskId/log-time', validate(logTimeSchema), auditLog('project', 'LOG_TIME', 'task'), projectController.logTime);

// Comments
router.get('/:id/tasks/:taskId/comments', projectController.getComments);
router.post('/:id/tasks/:taskId/comments', validate(addCommentSchema), auditLog('project', 'ADD_COMMENT', 'task'), projectController.addComment);

// Milestones
router.get('/:id/milestones', projectController.listMilestones);
router.post('/:id/milestones', validate(createMilestoneSchema), auditLog('project', 'CREATE', 'milestone'), projectController.createMilestone);
router.get('/:id/milestones/:milestoneId', projectController.getMilestone);
router.patch('/:id/milestones/:milestoneId', validate(updateMilestoneSchema), projectController.updateMilestone);
router.delete('/:id/milestones/:milestoneId', auditLog('project', 'DELETE', 'milestone'), projectController.removeMilestone);

// Timesheets
router.get('/timesheets', projectController.listTimesheets);
router.post('/timesheets', validate(createTimesheetSchema), auditLog('project', 'CREATE', 'timesheet'), projectController.createTimesheet);
router.get('/:id/timesheets', projectController.getProjectTimesheets);

export default router;
