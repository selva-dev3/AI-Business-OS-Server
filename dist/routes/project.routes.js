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
const auditLogger_1 = __importDefault(require("../middleware/auditLogger"));
const projectController = __importStar(require("../controllers/project.controller"));
const project_validator_1 = require("../validators/project.validator");
router.use(auth_1.authenticate);
// Projects
router.get('/', projectController.list);
router.post('/', (0, validate_1.validate)(project_validator_1.createProjectSchema), (0, auditLogger_1.default)('project', 'CREATE', 'project'), projectController.create);
router.get('/:id', projectController.getById);
router.patch('/:id', (0, validate_1.validate)(project_validator_1.updateProjectSchema), (0, auditLogger_1.default)('project', 'UPDATE', 'project'), projectController.update);
router.delete('/:id', (0, auditLogger_1.default)('project', 'DELETE', 'project'), projectController.remove);
router.get('/:id/summary', projectController.getSummary);
// Members
router.post('/:id/members', (0, validate_1.validate)(project_validator_1.addMemberSchema), (0, auditLogger_1.default)('project', 'ADD_MEMBER', 'project'), projectController.addMember);
router.delete('/:id/members/:userId', (0, auditLogger_1.default)('project', 'REMOVE_MEMBER', 'project'), projectController.removeMember);
// Tasks
router.get('/:id/tasks', projectController.listTasks);
router.post('/:id/tasks', (0, validate_1.validate)(project_validator_1.createTaskSchema), (0, auditLogger_1.default)('project', 'CREATE', 'task'), projectController.createTask);
router.get('/:id/tasks/:taskId', projectController.getTaskById);
router.patch('/:id/tasks/:taskId', (0, validate_1.validate)(project_validator_1.updateTaskSchema), projectController.updateTask);
router.delete('/:id/tasks/:taskId', (0, auditLogger_1.default)('project', 'DELETE', 'task'), projectController.removeTask);
router.patch('/:id/tasks/:taskId/move', (0, validate_1.validate)(project_validator_1.moveTaskSchema), projectController.moveTask);
// Time logging
router.post('/:id/tasks/:taskId/log-time', (0, validate_1.validate)(project_validator_1.logTimeSchema), (0, auditLogger_1.default)('project', 'LOG_TIME', 'task'), projectController.logTime);
// Comments
router.get('/:id/tasks/:taskId/comments', projectController.getComments);
router.post('/:id/tasks/:taskId/comments', (0, validate_1.validate)(project_validator_1.addCommentSchema), (0, auditLogger_1.default)('project', 'ADD_COMMENT', 'task'), projectController.addComment);
// Milestones
router.get('/:id/milestones', projectController.listMilestones);
router.post('/:id/milestones', (0, validate_1.validate)(project_validator_1.createMilestoneSchema), (0, auditLogger_1.default)('project', 'CREATE', 'milestone'), projectController.createMilestone);
router.get('/:id/milestones/:milestoneId', projectController.getMilestone);
router.patch('/:id/milestones/:milestoneId', (0, validate_1.validate)(project_validator_1.updateMilestoneSchema), projectController.updateMilestone);
router.delete('/:id/milestones/:milestoneId', (0, auditLogger_1.default)('project', 'DELETE', 'milestone'), projectController.removeMilestone);
// Timesheets
router.get('/timesheets', projectController.listTimesheets);
router.post('/timesheets', (0, validate_1.validate)(project_validator_1.createTimesheetSchema), (0, auditLogger_1.default)('project', 'CREATE', 'timesheet'), projectController.createTimesheet);
router.get('/:id/timesheets', projectController.getProjectTimesheets);
exports.default = router;
//# sourceMappingURL=project.routes.js.map