const ApiResponse = require('../utils/apiResponse');
const projectService = require('../services/project.service');

const list = async (req, res, next) => {
  try {
    const result = await projectService.list(req.companyId, req.query);
    return ApiResponse.paginated(res, result.projects, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const project = await projectService.create(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, project);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const project = await projectService.getById(req.companyId, req.params.id);
    return ApiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const project = await projectService.update(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await projectService.remove(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const member = await projectService.addMember(req.companyId, req.params.id, req.body);
    return ApiResponse.created(res, member);
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await projectService.removeMember(req.companyId, req.params.id, req.params.userId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const result = await projectService.listTasks(req.companyId, req.params.id, req.query);
    return ApiResponse.paginated(res, result.tasks, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const task = await projectService.createTask(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.created(res, task);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await projectService.getTaskById(req.companyId, req.params.id);
    return ApiResponse.success(res, task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const task = await projectService.updateTask(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, task);
  } catch (error) {
    next(error);
  }
};

const removeTask = async (req, res, next) => {
  try {
    const result = await projectService.removeTask(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const moveTask = async (req, res, next) => {
  try {
    const task = await projectService.moveTask(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, task);
  } catch (error) {
    next(error);
  }
};

const logTime = async (req, res, next) => {
  try {
    const entry = await projectService.logTime(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.created(res, entry);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const comment = await projectService.addComment(req.companyId, req.params.id, req.user._id, req.body);
    return ApiResponse.created(res, comment);
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await projectService.getComments(req.companyId, req.params.id);
    return ApiResponse.success(res, comments);
  } catch (error) {
    next(error);
  }
};

const listMilestones = async (req, res, next) => {
  try {
    const milestones = await projectService.listMilestones(req.companyId, req.params.id);
    return ApiResponse.success(res, milestones);
  } catch (error) {
    next(error);
  }
};

const getMilestone = async (req, res, next) => {
  try {
    const milestone = await projectService.getMilestoneById(req.companyId, req.params.id);
    return ApiResponse.success(res, milestone);
  } catch (error) {
    next(error);
  }
};

const createMilestone = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const milestone = await projectService.createMilestone(req.companyId, req.params.id, req.body);
    return ApiResponse.created(res, milestone);
  } catch (error) {
    next(error);
  }
};

const updateMilestone = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const milestone = await projectService.updateMilestone(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, milestone);
  } catch (error) {
    next(error);
  }
};

const removeMilestone = async (req, res, next) => {
  try {
    const result = await projectService.removeMilestone(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listTimesheets = async (req, res, next) => {
  try {
    const result = await projectService.listTimesheets(req.companyId, req.query);
    return ApiResponse.paginated(res, result.entries, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      summary: result.summary,
    });
  } catch (error) {
    next(error);
  }
};

const createTimesheet = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const entry = await projectService.createTimesheet(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, entry);
  } catch (error) {
    next(error);
  }
};

const getProjectTimesheets = async (req, res, next) => {
  try {
    const result = await projectService.getProjectTimesheets(req.companyId, req.params.id, req.query);
    return ApiResponse.paginated(res, result.entries, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      summary: result.summary,
    });
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summary = await projectService.getSummary(req.companyId, req.params.id);
    return ApiResponse.success(res, summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
  getMilestone,
  createMilestone,
  updateMilestone,
  removeMilestone,
  listTimesheets,
  createTimesheet,
  getProjectTimesheets,
  getSummary,
};
