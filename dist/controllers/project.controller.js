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
exports.getSummary = exports.getProjectTimesheets = exports.createTimesheet = exports.listTimesheets = exports.removeMilestone = exports.updateMilestone = exports.createMilestone = exports.getMilestone = exports.listMilestones = exports.getComments = exports.addComment = exports.logTime = exports.moveTask = exports.removeTask = exports.updateTask = exports.getTaskById = exports.createTask = exports.listTasks = exports.removeMember = exports.addMember = exports.remove = exports.update = exports.getById = exports.create = exports.list = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const projectService = __importStar(require("../services/project.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
exports.list = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.list(companyId, req.query);
    const totalPages = Math.ceil(result.total / result.limit);
    apiResponse_1.default.paginated(res, result.projects, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1,
    });
});
exports.create = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const project = await projectService.create(companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, project);
});
exports.getById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const project = await projectService.getById(companyId, req.params.id);
    apiResponse_1.default.success(res, project);
});
exports.update = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const project = await projectService.update(companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, project);
});
exports.remove = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.remove(companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.addMember = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const member = await projectService.addMember(companyId, req.params.id, req.body);
    apiResponse_1.default.created(res, member);
});
exports.removeMember = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.removeMember(companyId, req.params.id, req.params.userId);
    apiResponse_1.default.success(res, result);
});
exports.listTasks = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.listTasks(companyId, req.params.id, req.query);
    const totalPages = Math.ceil(result.total / result.limit);
    apiResponse_1.default.paginated(res, result.tasks, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1,
    });
});
exports.createTask = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const task = await projectService.createTask(companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, task);
});
exports.getTaskById = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const task = await projectService.getTaskById(companyId, req.params.id);
    apiResponse_1.default.success(res, task);
});
exports.updateTask = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const task = await projectService.updateTask(companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, task);
});
exports.removeTask = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.removeTask(companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.moveTask = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const task = await projectService.moveTask(companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, task);
});
exports.logTime = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const entry = await projectService.logTime(companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, entry);
});
exports.addComment = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const comment = await projectService.addComment(companyId, req.params.id, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, comment);
});
exports.getComments = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const comments = await projectService.getComments(companyId, req.params.id);
    apiResponse_1.default.success(res, comments);
});
exports.listMilestones = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const milestones = await projectService.listMilestones(companyId, req.params.id);
    apiResponse_1.default.success(res, milestones);
});
exports.getMilestone = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const milestone = await projectService.getMilestoneById(companyId, req.params.id);
    apiResponse_1.default.success(res, milestone);
});
exports.createMilestone = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const milestone = await projectService.createMilestone(companyId, req.params.id, req.body);
    apiResponse_1.default.created(res, milestone);
});
exports.updateMilestone = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const milestone = await projectService.updateMilestone(companyId, req.params.id, req.body);
    apiResponse_1.default.success(res, milestone);
});
exports.removeMilestone = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.removeMilestone(companyId, req.params.id);
    apiResponse_1.default.success(res, result);
});
exports.listTimesheets = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.listTimesheets(companyId, req.query);
    const totalPages = Math.ceil(result.total / result.limit);
    apiResponse_1.default.paginated(res, result.entries, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1,
    });
});
exports.createTimesheet = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    req.originalBody = req.body;
    const entry = await projectService.createTimesheet(companyId, req.user._id.toString(), req.body);
    apiResponse_1.default.created(res, entry);
});
exports.getProjectTimesheets = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const result = await projectService.getProjectTimesheets(companyId, req.params.id, req.query);
    const totalPages = Math.ceil(result.total / result.limit);
    apiResponse_1.default.paginated(res, result.entries, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1,
    });
});
exports.getSummary = (0, catchAsync_1.default)(async (req, res, _next) => {
    const companyId = req.companyId;
    const summary = await projectService.getSummary(companyId, req.params.id);
    apiResponse_1.default.success(res, summary);
});
//# sourceMappingURL=project.controller.js.map