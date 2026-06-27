import Project from '../models/Project';
import ProjectMember from '../models/ProjectMember';
import Task from '../models/Task';
import Milestone from '../models/Milestone';
import Timesheet from '../models/Timesheet';
import TaskComment from '../models/TaskComment';
import AppError from '../utils/appError';
import { generateCode, buildSearchQuery } from '../utils/helpers';

interface QueryParams {
  status?: string;
  ownerId?: string;
  search?: string;
  page?: string;
  limit?: string;
  assignee?: string;
  priority?: string;
  milestone?: string;
  userId?: string;
  projectId?: string;
  taskId?: string;
  startDate?: string;
  endDate?: string;
}

const list = async (companyId: string, query: QueryParams) => {
  const { status, ownerId, search } = query;
  const filter: Record<string, unknown> = { companyId };

  if (status) filter.status = status;
  if (ownerId) filter.ownerId = ownerId;
  if (search) Object.assign(filter, buildSearchQuery(search, ['name', 'code', 'description']));

  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
  const skip = (page - 1) * limit;
  const l = limit;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
    Project.countDocuments(filter),
  ]);

  return { projects, total, page, limit: l };
};

const create = async (companyId: string, userId: string, data: Record<string, unknown>) => {
  const count = await Project.countDocuments({ companyId });
  const code = (data.code as string) || generateCode('PRJ', count + 1);

  const existing = await Project.findOne({ code, companyId });
  if (existing) throw new AppError(409, 'CONFLICT', 'Project code already exists');

  const project = await Project.create({ ...data, code, companyId, ownerId: userId });

  await ProjectMember.create({ projectId: project._id, userId, role: 'PROJECT_MANAGER' });

  return project;
};

const getById = async (companyId: string, projectId: string): Promise<any> => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const [members, milestones, taskStats] = await Promise.all([
    ProjectMember.find({ projectId }).populate('userId', 'firstName lastName email avatar'),
    Milestone.find({ projectId }).sort({ dueDate: 1 }),
    Task.aggregate([
      { $match: { projectId: project._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const stats: Record<string, number> = {};
  (taskStats as { _id: string; count: number }[]).forEach(s => { stats[s._id] = s.count; });

  return {
    ...project.toJSON(),
    members,
    milestones,
    taskStats: stats,
  };
};

const update = async (companyId: string, projectId: string, data: Record<string, unknown>) => {
  if (data.code) {
    const dup = await Project.findOne({ code: data.code as string, companyId, _id: { $ne: projectId } });
    if (dup) throw new AppError(409, 'CONFLICT', 'Project code already exists');
  }

  const project = await Project.findOneAndUpdate(
    { _id: projectId, companyId },
    data,
    { new: true, runValidators: true }
  );
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');
  return project;
};

const remove = async (companyId: string, projectId: string) => {
  const project = await Project.findOneAndDelete({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  await Promise.all([
    ProjectMember.deleteMany({ projectId }),
    Task.deleteMany({ projectId }),
    Milestone.deleteMany({ projectId }),
    Timesheet.deleteMany({ projectId }),
    TaskComment.deleteMany({ projectId }),
  ]);

  return { success: true };
};

const addMember = async (companyId: string, projectId: string, data: Record<string, unknown>) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const existing = await ProjectMember.findOne({ projectId, userId: data.userId });
  if (existing) throw new AppError(409, 'CONFLICT', 'User is already a member');

  const member = await ProjectMember.create({ projectId, ...data });
  return member.populate('userId', 'firstName lastName email avatar');
};

const removeMember = async (companyId: string, projectId: string, userId: string) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  if (String(project.ownerId) === userId) {
    throw new AppError(400, 'BAD_REQUEST', 'Cannot remove the project owner');
  }

  const member = await ProjectMember.findOneAndDelete({ projectId, userId });
  if (!member) throw new AppError(404, 'NOT_FOUND', 'Member not found');

  return { success: true };
};

const listTasks = async (companyId: string, projectId: string, query: QueryParams) => {
  const { status, assignee, priority, milestone, search } = query;
  const filter: Record<string, unknown> = { projectId, companyId };

  if (status) filter.status = status;
  if (assignee) filter.assigneeId = assignee;
  if (priority) filter.priority = priority;
  if (milestone) filter.milestoneId = milestone;
  if (search) Object.assign(filter, buildSearchQuery(search, ['title', 'description']));

  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(200, Math.max(1, parseInt(query.limit || '50')));
  const skip = (page - 1) * limit;
  const l = limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('assigneeId', 'firstName lastName email avatar')
      .populate('reporterId', 'firstName lastName email avatar')
      .populate('milestoneId', 'name status')
      .sort({ position: 1, createdAt: -1 })
      .skip(skip)
      .limit(l),
    Task.countDocuments(filter),
  ]);

  return { tasks, total, page, limit: l };
};

const createTask = async (companyId: string, projectId: string, userId: string, data: Record<string, unknown>) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const maxPos = await Task.findOne({ projectId, status: (data.status as string) || 'TODO' })
    .sort({ position: -1 })
    .select('position');

  const task = await Task.create({
    ...data,
    projectId,
    companyId,
    reporterId: userId,
    position: ((maxPos?.position as number) ?? -1) + 1,
  });

  return task.populate([
    { path: 'assigneeId', select: 'firstName lastName email avatar' },
    { path: 'reporterId', select: 'firstName lastName email avatar' },
    { path: 'milestoneId', select: 'name status' },
  ]);
};

const getTaskById = async (companyId: string, taskId: string): Promise<any> => {
  const task = await Task.findOne({ _id: taskId, companyId })
    .populate('assigneeId', 'firstName lastName email avatar')
    .populate('reporterId', 'firstName lastName email avatar')
    .populate('milestoneId', 'name status');

  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const [subtasks, comments, timesheets] = await Promise.all([
    Task.find({ parentTaskId: taskId }).sort({ position: 1 }),
    TaskComment.find({ taskId }).populate('userId', 'firstName lastName email avatar').sort({ createdAt: -1 }),
    Timesheet.find({ taskId }).sort({ date: -1 }),
  ]);

  return { ...task.toJSON(), subtasks, comments, timesheets };
};

const updateTask = async (companyId: string, taskId: string, data: Record<string, unknown>) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, companyId },
    data,
    { new: true, runValidators: true }
  )
    .populate('assigneeId', 'firstName lastName email avatar')
    .populate('reporterId', 'firstName lastName email avatar')
    .populate('milestoneId', 'name status');

  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');
  return task;
};

const removeTask = async (companyId: string, taskId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, companyId });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  await Promise.all([
    Task.updateMany({ parentTaskId: taskId }, { parentTaskId: null }),
    TaskComment.deleteMany({ taskId }),
    Timesheet.deleteMany({ taskId }),
  ]);

  return { success: true };
};

const moveTask = async (companyId: string, taskId: string, data: Record<string, unknown>) => {
  const task = await Task.findOne({ _id: taskId, companyId });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const { status, position } = data as { status: string; position: number };

  if (status !== task.status) {
    await Task.updateMany(
      { projectId: task.projectId, status: task.status, position: { $gt: task.position } },
      { $inc: { position: -1 } }
    );

    await Task.updateMany(
      { projectId: task.projectId, status, position: { $gte: position } },
      { $inc: { position: 1 } }
    );

    task.status = status;
  } else {
    const oldPos = task.position!;
    if (position > oldPos) {
      await Task.updateMany(
        { projectId: task.projectId, status, position: { $gt: oldPos, $lte: position } },
        { $inc: { position: -1 } }
      );
    } else if (position < oldPos) {
      await Task.updateMany(
        { projectId: task.projectId, status, position: { $gte: position, $lt: oldPos } },
        { $inc: { position: 1 } }
      );
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

const logTime = async (companyId: string, taskId: string, userId: string, data: Record<string, unknown>) => {
  const task = await Task.findOne({ _id: taskId, companyId });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const entry = await Timesheet.create({
    projectId: task.projectId,
    taskId,
    userId,
    companyId,
    date: data.date,
    hours: data.hours,
    description: data.description,
    isBillable: data.isBillable,
  });

  const hoursAgg = await Timesheet.aggregate([
    { $match: { taskId: task._id } },
    { $group: { _id: null, total: { $sum: '$hours' } } },
  ]);

  const totalHours = (hoursAgg[0] as { total?: number } | undefined)?.total || 0;
  await Task.findByIdAndUpdate(taskId, { loggedHours: totalHours });

  return entry;
};

const addComment = async (companyId: string, taskId: string, userId: string, data: Record<string, unknown>) => {
  const task = await Task.findOne({ _id: taskId, companyId });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  const comment = await TaskComment.create({
    taskId,
    projectId: task.projectId,
    content: data.content,
    userId,
  });

  return comment.populate('userId', 'firstName lastName email avatar');
};

const getComments = async (companyId: string, taskId: string) => {
  const task = await Task.findOne({ _id: taskId, companyId });
  if (!task) throw new AppError(404, 'NOT_FOUND', 'Task not found');

  return TaskComment.find({ taskId })
    .populate('userId', 'firstName lastName email avatar')
    .sort({ createdAt: -1 });
};

const listMilestones = async (companyId: string, projectId: string) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  return Milestone.find({ projectId }).sort({ dueDate: 1 });
};

const getMilestoneById = async (companyId: string, milestoneId: string) => {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) throw new AppError(404, 'NOT_FOUND', 'Milestone not found');

  const project = await Project.findOne({ _id: milestone.projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  return milestone;
};

const createMilestone = async (companyId: string, projectId: string, data: Record<string, unknown>) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  return Milestone.create({ ...data, projectId });
};

const updateMilestone = async (companyId: string, milestoneId: string, data: Record<string, unknown>) => {
  const milestone = await Milestone.findOneAndUpdate(
    { _id: milestoneId },
    { ...data, ...(data.status === 'COMPLETED' ? { completedAt: new Date() } : {}) },
    { new: true, runValidators: true }
  );

  if (!milestone) throw new AppError(404, 'NOT_FOUND', 'Milestone not found');

  const project = await Project.findOne({ _id: milestone.projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  return milestone;
};

const removeMilestone = async (companyId: string, milestoneId: string) => {
  const milestone = await Milestone.findOneAndDelete({ _id: milestoneId });
  if (!milestone) throw new AppError(404, 'NOT_FOUND', 'Milestone not found');

  const project = await Project.findOne({ _id: milestone.projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  await Task.updateMany({ milestoneId }, { milestoneId: null });

  return { success: true };
};

const listTimesheets = async (companyId: string, query: QueryParams) => {
  const { userId, projectId, taskId, startDate, endDate } = query;
  const filter: Record<string, unknown> = { companyId };

  if (userId) filter.userId = userId;
  if (projectId) filter.projectId = projectId;
  if (taskId) filter.taskId = taskId;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) (filter.date as Record<string, unknown>).$gte = new Date(startDate);
    if (endDate) (filter.date as Record<string, unknown>).$lte = new Date(endDate);
  }

  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
  const skip = (page - 1) * limit;
  const l = limit;

  const [entries, total, totals] = await Promise.all([
    Timesheet.find(filter)
      .populate('userId', 'firstName lastName email avatar')
      .populate('taskId', 'title')
      .populate('projectId', 'name code')
      .sort({ date: -1 })
      .skip(skip)
      .limit(l),
    Timesheet.countDocuments(filter),
    Timesheet.aggregate([
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

  const summary = (totals[0] as { totalHours?: number; billableHours?: number }) || { totalHours: 0, billableHours: 0 };

  return { entries, total, page, limit: l, summary };
};

const createTimesheet = async (companyId: string, userId: string, data: Record<string, unknown>) => {
  return Timesheet.create({ ...data, userId, companyId });
};

const getProjectTimesheets = async (companyId: string, projectId: string, query: QueryParams) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const { startDate, endDate, userId } = query;
  const filter: Record<string, unknown> = { projectId, companyId };

  if (userId) filter.userId = userId;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) (filter.date as Record<string, unknown>).$gte = new Date(startDate);
    if (endDate) (filter.date as Record<string, unknown>).$lte = new Date(endDate);
  }

  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
  const skip = (page - 1) * limit;
  const l = limit;

  const [entries, total, totals] = await Promise.all([
    Timesheet.find(filter)
      .populate('userId', 'firstName lastName email avatar')
      .populate('taskId', 'title')
      .sort({ date: -1 })
      .skip(skip)
      .limit(l),
    Timesheet.countDocuments(filter),
    Timesheet.aggregate([
      { $match: filter },
      { $group: { _id: null, totalHours: { $sum: '$hours' }, billableHours: { $sum: { $cond: ['$isBillable', '$hours', 0] } } } },
    ]),
  ]);

  const summary = (totals[0] as { totalHours?: number; billableHours?: number }) || { totalHours: 0, billableHours: 0 };

  return { entries, total, page, limit: l, summary };
};

const getSummary = async (companyId: string, projectId: string) => {
  const project = await Project.findOne({ _id: projectId, companyId });
  if (!project) throw new AppError(404, 'NOT_FOUND', 'Project not found');

  const [taskStats, memberCount, milestoneStats, timeStats] = await Promise.all([
    Task.aggregate([
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
    ProjectMember.countDocuments({ projectId }),
    Milestone.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
        },
      },
    ]),
    Timesheet.aggregate([
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

  const ts = (taskStats[0] as { total: number; completed: number; inProgress: number; review: number; todo: number }) || { total: 0, completed: 0, inProgress: 0, review: 0, todo: 0 };
  const ms = (milestoneStats[0] as { total: number; completed: number }) || { total: 0, completed: 0 };
  const times = (timeStats[0] as { totalHours: number; billableHours: number }) || { totalHours: 0, billableHours: 0 };

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

export {
  list,
  create,
  getById,
  update,
  remove,
  addMember,
  removeMember,
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  removeTask,
  moveTask,
  logTime,
  addComment,
  getComments,
  listMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  removeMilestone,
  listTimesheets,
  createTimesheet,
  getProjectTimesheets,
  getSummary,
};
