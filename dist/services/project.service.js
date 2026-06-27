"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = exports.getProjectTimesheets = exports.createTimesheet = exports.listTimesheets = exports.removeMilestone = exports.updateMilestone = exports.createMilestone = exports.getMilestoneById = exports.listMilestones = exports.getComments = exports.addComment = exports.logTime = exports.moveTask = exports.removeTask = exports.updateTask = exports.getTaskById = exports.createTask = exports.listTasks = exports.removeMember = exports.addMember = exports.remove = exports.update = exports.getById = exports.create = exports.list = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const ProjectMember_1 = __importDefault(require("../models/ProjectMember"));
const Task_1 = __importDefault(require("../models/Task"));
const Milestone_1 = __importDefault(require("../models/Milestone"));
const Timesheet_1 = __importDefault(require("../models/Timesheet"));
const TaskComment_1 = __importDefault(require("../models/TaskComment"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const list = async (companyId, query) => {
    const { status, ownerId, search } = query;
    const filter = { companyId };
    if (status)
        filter.status = status;
    if (ownerId)
        filter.ownerId = ownerId;
    if (search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(search, ['name', 'code', 'description']));
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
    const skip = (page - 1) * limit;
    const l = limit;
    const [projects, total] = await Promise.all([
        Project_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
        Project_1.default.countDocuments(filter),
    ]);
    return { projects, total, page, limit: l };
};
exports.list = list;
const create = async (companyId, userId, data) => {
    const count = await Project_1.default.countDocuments({ companyId });
    const code = data.code || (0, helpers_1.generateCode)('PRJ', count + 1);
    const existing = await Project_1.default.findOne({ code, companyId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Project code already exists');
    const project = await Project_1.default.create({ ...data, code, companyId, ownerId: userId });
    await ProjectMember_1.default.create({ projectId: project._id, userId, role: 'PROJECT_MANAGER' });
    return project;
};
exports.create = create;
const getById = async (companyId, projectId) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    const [members, milestones, taskStats] = await Promise.all([
        ProjectMember_1.default.find({ projectId }).populate('userId', 'firstName lastName email avatar'),
        Milestone_1.default.find({ projectId }).sort({ dueDate: 1 }),
        Task_1.default.aggregate([
            { $match: { projectId: project._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
    ]);
    const stats = {};
    taskStats.forEach(s => { stats[s._id] = s.count; });
    return {
        ...project.toJSON(),
        members,
        milestones,
        taskStats: stats,
    };
};
exports.getById = getById;
const update = async (companyId, projectId, data) => {
    if (data.code) {
        const dup = await Project_1.default.findOne({ code: data.code, companyId, _id: { $ne: projectId } });
        if (dup)
            throw new appError_1.default(409, 'CONFLICT', 'Project code already exists');
    }
    const project = await Project_1.default.findOneAndUpdate({ _id: projectId, companyId }, data, { new: true, runValidators: true });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    return project;
};
exports.update = update;
const remove = async (companyId, projectId) => {
    const project = await Project_1.default.findOneAndDelete({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    await Promise.all([
        ProjectMember_1.default.deleteMany({ projectId }),
        Task_1.default.deleteMany({ projectId }),
        Milestone_1.default.deleteMany({ projectId }),
        Timesheet_1.default.deleteMany({ projectId }),
        TaskComment_1.default.deleteMany({ projectId }),
    ]);
    return { success: true };
};
exports.remove = remove;
const addMember = async (companyId, projectId, data) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    const existing = await ProjectMember_1.default.findOne({ projectId, userId: data.userId });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'User is already a member');
    const member = await ProjectMember_1.default.create({ projectId, ...data });
    return member.populate('userId', 'firstName lastName email avatar');
};
exports.addMember = addMember;
const removeMember = async (companyId, projectId, userId) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    if (String(project.ownerId) === userId) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot remove the project owner');
    }
    const member = await ProjectMember_1.default.findOneAndDelete({ projectId, userId });
    if (!member)
        throw new appError_1.default(404, 'NOT_FOUND', 'Member not found');
    return { success: true };
};
exports.removeMember = removeMember;
const listTasks = async (companyId, projectId, query) => {
    const { status, assignee, priority, milestone, search } = query;
    const filter = { projectId, companyId };
    if (status)
        filter.status = status;
    if (assignee)
        filter.assigneeId = assignee;
    if (priority)
        filter.priority = priority;
    if (milestone)
        filter.milestoneId = milestone;
    if (search)
        Object.assign(filter, (0, helpers_1.buildSearchQuery)(search, ['title', 'description']));
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(200, Math.max(1, parseInt(query.limit || '50')));
    const skip = (page - 1) * limit;
    const l = limit;
    const [tasks, total] = await Promise.all([
        Task_1.default.find(filter)
            .populate('assigneeId', 'firstName lastName email avatar')
            .populate('reporterId', 'firstName lastName email avatar')
            .populate('milestoneId', 'name status')
            .sort({ position: 1, createdAt: -1 })
            .skip(skip)
            .limit(l),
        Task_1.default.countDocuments(filter),
    ]);
    return { tasks, total, page, limit: l };
};
exports.listTasks = listTasks;
const createTask = async (companyId, projectId, userId, data) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    const maxPos = await Task_1.default.findOne({ projectId, status: data.status || 'TODO' })
        .sort({ position: -1 })
        .select('position');
    const task = await Task_1.default.create({
        ...data,
        projectId,
        companyId,
        reporterId: userId,
        position: (maxPos?.position ?? -1) + 1,
    });
    return task.populate([
        { path: 'assigneeId', select: 'firstName lastName email avatar' },
        { path: 'reporterId', select: 'firstName lastName email avatar' },
        { path: 'milestoneId', select: 'name status' },
    ]);
};
exports.createTask = createTask;
const getTaskById = async (companyId, taskId) => {
    const task = await Task_1.default.findOne({ _id: taskId, companyId })
        .populate('assigneeId', 'firstName lastName email avatar')
        .populate('reporterId', 'firstName lastName email avatar')
        .populate('milestoneId', 'name status');
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    const [subtasks, comments, timesheets] = await Promise.all([
        Task_1.default.find({ parentTaskId: taskId }).sort({ position: 1 }),
        TaskComment_1.default.find({ taskId }).populate('userId', 'firstName lastName email avatar').sort({ createdAt: -1 }),
        Timesheet_1.default.find({ taskId }).sort({ date: -1 }),
    ]);
    return { ...task.toJSON(), subtasks, comments, timesheets };
};
exports.getTaskById = getTaskById;
const updateTask = async (companyId, taskId, data) => {
    const task = await Task_1.default.findOneAndUpdate({ _id: taskId, companyId }, data, { new: true, runValidators: true })
        .populate('assigneeId', 'firstName lastName email avatar')
        .populate('reporterId', 'firstName lastName email avatar')
        .populate('milestoneId', 'name status');
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    return task;
};
exports.updateTask = updateTask;
const removeTask = async (companyId, taskId) => {
    const task = await Task_1.default.findOneAndDelete({ _id: taskId, companyId });
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    await Promise.all([
        Task_1.default.updateMany({ parentTaskId: taskId }, { parentTaskId: null }),
        TaskComment_1.default.deleteMany({ taskId }),
        Timesheet_1.default.deleteMany({ taskId }),
    ]);
    return { success: true };
};
exports.removeTask = removeTask;
const moveTask = async (companyId, taskId, data) => {
    const task = await Task_1.default.findOne({ _id: taskId, companyId });
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    const { status, position } = data;
    if (status !== task.status) {
        await Task_1.default.updateMany({ projectId: task.projectId, status: task.status, position: { $gt: task.position } }, { $inc: { position: -1 } });
        await Task_1.default.updateMany({ projectId: task.projectId, status, position: { $gte: position } }, { $inc: { position: 1 } });
        task.status = status;
    }
    else {
        const oldPos = task.position;
        if (position > oldPos) {
            await Task_1.default.updateMany({ projectId: task.projectId, status, position: { $gt: oldPos, $lte: position } }, { $inc: { position: -1 } });
        }
        else if (position < oldPos) {
            await Task_1.default.updateMany({ projectId: task.projectId, status, position: { $gte: position, $lt: oldPos } }, { $inc: { position: 1 } });
        }
    }
    task.position = position;
    await task.save();
    return task.populate([
        { path: 'assigneeId', select: 'firstName lastName email avatar' },
        { path: 'reporterId', select: 'firstName lastName email avatar' },
        { path: 'milestoneId', select: 'name status' },
    ]);
};
exports.moveTask = moveTask;
const logTime = async (companyId, taskId, userId, data) => {
    const task = await Task_1.default.findOne({ _id: taskId, companyId });
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    const entry = await Timesheet_1.default.create({
        projectId: task.projectId,
        taskId,
        userId,
        companyId,
        date: data.date,
        hours: data.hours,
        description: data.description,
        isBillable: data.isBillable,
    });
    const hoursAgg = await Timesheet_1.default.aggregate([
        { $match: { taskId: task._id } },
        { $group: { _id: null, total: { $sum: '$hours' } } },
    ]);
    const totalHours = hoursAgg[0]?.total || 0;
    await Task_1.default.findByIdAndUpdate(taskId, { loggedHours: totalHours });
    return entry;
};
exports.logTime = logTime;
const addComment = async (companyId, taskId, userId, data) => {
    const task = await Task_1.default.findOne({ _id: taskId, companyId });
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    const comment = await TaskComment_1.default.create({
        taskId,
        projectId: task.projectId,
        content: data.content,
        userId,
    });
    return comment.populate('userId', 'firstName lastName email avatar');
};
exports.addComment = addComment;
const getComments = async (companyId, taskId) => {
    const task = await Task_1.default.findOne({ _id: taskId, companyId });
    if (!task)
        throw new appError_1.default(404, 'NOT_FOUND', 'Task not found');
    return TaskComment_1.default.find({ taskId })
        .populate('userId', 'firstName lastName email avatar')
        .sort({ createdAt: -1 });
};
exports.getComments = getComments;
const listMilestones = async (companyId, projectId) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    return Milestone_1.default.find({ projectId }).sort({ dueDate: 1 });
};
exports.listMilestones = listMilestones;
const getMilestoneById = async (companyId, milestoneId) => {
    const milestone = await Milestone_1.default.findById(milestoneId);
    if (!milestone)
        throw new appError_1.default(404, 'NOT_FOUND', 'Milestone not found');
    const project = await Project_1.default.findOne({ _id: milestone.projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    return milestone;
};
exports.getMilestoneById = getMilestoneById;
const createMilestone = async (companyId, projectId, data) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    return Milestone_1.default.create({ ...data, projectId });
};
exports.createMilestone = createMilestone;
const updateMilestone = async (companyId, milestoneId, data) => {
    const milestone = await Milestone_1.default.findOneAndUpdate({ _id: milestoneId }, { ...data, ...(data.status === 'COMPLETED' ? { completedAt: new Date() } : {}) }, { new: true, runValidators: true });
    if (!milestone)
        throw new appError_1.default(404, 'NOT_FOUND', 'Milestone not found');
    const project = await Project_1.default.findOne({ _id: milestone.projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    return milestone;
};
exports.updateMilestone = updateMilestone;
const removeMilestone = async (companyId, milestoneId) => {
    const milestone = await Milestone_1.default.findOneAndDelete({ _id: milestoneId });
    if (!milestone)
        throw new appError_1.default(404, 'NOT_FOUND', 'Milestone not found');
    const project = await Project_1.default.findOne({ _id: milestone.projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    await Task_1.default.updateMany({ milestoneId }, { milestoneId: null });
    return { success: true };
};
exports.removeMilestone = removeMilestone;
const listTimesheets = async (companyId, query) => {
    const { userId, projectId, taskId, startDate, endDate } = query;
    const filter = { companyId };
    if (userId)
        filter.userId = userId;
    if (projectId)
        filter.projectId = projectId;
    if (taskId)
        filter.taskId = taskId;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate)
            filter.date.$gte = new Date(startDate);
        if (endDate)
            filter.date.$lte = new Date(endDate);
    }
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
    const skip = (page - 1) * limit;
    const l = limit;
    const [entries, total, totals] = await Promise.all([
        Timesheet_1.default.find(filter)
            .populate('userId', 'firstName lastName email avatar')
            .populate('taskId', 'title')
            .populate('projectId', 'name code')
            .sort({ date: -1 })
            .skip(skip)
            .limit(l),
        Timesheet_1.default.countDocuments(filter),
        Timesheet_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalHours: { $sum: '$hours' },
                    billableHours: { $sum: { $cond: ['$isBillable', '$hours', 0] } },
                },
            },
        ]),
    ]);
    const summary = totals[0] || { totalHours: 0, billableHours: 0 };
    return { entries, total, page, limit: l, summary };
};
exports.listTimesheets = listTimesheets;
const createTimesheet = async (companyId, userId, data) => {
    return Timesheet_1.default.create({ ...data, userId, companyId });
};
exports.createTimesheet = createTimesheet;
const getProjectTimesheets = async (companyId, projectId, query) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    const { startDate, endDate, userId } = query;
    const filter = { projectId, companyId };
    if (userId)
        filter.userId = userId;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate)
            filter.date.$gte = new Date(startDate);
        if (endDate)
            filter.date.$lte = new Date(endDate);
    }
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
    const skip = (page - 1) * limit;
    const l = limit;
    const [entries, total, totals] = await Promise.all([
        Timesheet_1.default.find(filter)
            .populate('userId', 'firstName lastName email avatar')
            .populate('taskId', 'title')
            .sort({ date: -1 })
            .skip(skip)
            .limit(l),
        Timesheet_1.default.countDocuments(filter),
        Timesheet_1.default.aggregate([
            { $match: filter },
            { $group: { _id: null, totalHours: { $sum: '$hours' }, billableHours: { $sum: { $cond: ['$isBillable', '$hours', 0] } } } },
        ]),
    ]);
    const summary = totals[0] || { totalHours: 0, billableHours: 0 };
    return { entries, total, page, limit: l, summary };
};
exports.getProjectTimesheets = getProjectTimesheets;
const getSummary = async (companyId, projectId) => {
    const project = await Project_1.default.findOne({ _id: projectId, companyId });
    if (!project)
        throw new appError_1.default(404, 'NOT_FOUND', 'Project not found');
    const [taskStats, memberCount, milestoneStats, timeStats] = await Promise.all([
        Task_1.default.aggregate([
            { $match: { projectId: project._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
                    review: { $sum: { $cond: [{ $eq: ['$status', 'REVIEW'] }, 1, 0] } },
                    todo: { $sum: { $cond: [{ $eq: ['$status', 'TODO'] }, 1, 0] } },
                },
            },
        ]),
        ProjectMember_1.default.countDocuments({ projectId }),
        Milestone_1.default.aggregate([
            { $match: { projectId: project._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
                },
            },
        ]),
        Timesheet_1.default.aggregate([
            { $match: { projectId: project._id } },
            {
                $group: {
                    _id: null,
                    totalHours: { $sum: '$hours' },
                    billableHours: { $sum: { $cond: ['$isBillable', '$hours', 0] } },
                },
            },
        ]),
    ]);
    const ts = taskStats[0] || { total: 0, completed: 0, inProgress: 0, review: 0, todo: 0 };
    const ms = milestoneStats[0] || { total: 0, completed: 0 };
    const times = timeStats[0] || { totalHours: 0, billableHours: 0 };
    const completion = ts.total > 0 ? Math.round((ts.completed / ts.total) * 100) : 0;
    const timeline = project.startDate && project.endDate
        ? { start: project.startDate, end: project.endDate, remaining: Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) }
        : null;
    return {
        completion: { percent: completion, tasks: ts },
        timeline,
        budget: project.budget ? { total: project.budget } : null,
        team: { totalMembers: memberCount },
        milestones: ms,
        timeTracking: times,
    };
};
exports.getSummary = getSummary;
//# sourceMappingURL=project.service.js.map