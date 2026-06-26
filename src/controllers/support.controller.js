const ApiResponse = require('../utils/apiResponse');
const supportService = require('../services/support.service');

const listTickets = async (req, res, next) => {
  try {
    const result = await supportService.list(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const ticket = await supportService.create(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, ticket);
  } catch (error) {
    next(error);
  }
};

const getTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.getById(req.companyId, req.params.id);
    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const ticket = await supportService.update(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const result = await supportService.remove(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const replyTicket = async (req, res, next) => {
  try {
    const reply = await supportService.reply(req.companyId, req.user._id, req.params.id, req.body);
    return ApiResponse.created(res, reply);
  } catch (error) {
    next(error);
  }
};

const assignTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.assign(req.companyId, req.user._id, req.params.id, req.body.assigneeId);
    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

const changeTicketStatus = async (req, res, next) => {
  try {
    const ticket = await supportService.changeStatus(req.companyId, req.user._id, req.params.id, req.body.status, req.body.resolution);
    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

const changeTicketPriority = async (req, res, next) => {
  try {
    const ticket = await supportService.changePriority(req.companyId, req.user._id, req.params.id, req.body.priority);
    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

const closeTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.close(req.companyId, req.user._id, req.params.id, req.body.resolution);
    return ApiResponse.success(res, ticket);
  } catch (error) {
    next(error);
  }
};

const getTicketAISummary = async (req, res, next) => {
  try {
    const summary = await supportService.getAISummary(req.companyId, req.params.id);
    return ApiResponse.success(res, summary);
  } catch (error) {
    next(error);
  }
};

const listCategories = async (req, res, next) => {
  try {
    const categories = await supportService.listCategories(req.companyId);
    return ApiResponse.success(res, categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const category = await supportService.createCategory(req.companyId, req.body);
    return ApiResponse.created(res, category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await supportService.updateCategory(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await supportService.removeCategory(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getReportSummary = async (req, res, next) => {
  try {
    const summary = await supportService.getSummary(req.companyId);
    return ApiResponse.success(res, summary);
  } catch (error) {
    next(error);
  }
};

const getReportSLA = async (req, res, next) => {
  try {
    const sla = await supportService.getSLA(req.companyId);
    return ApiResponse.success(res, sla);
  } catch (error) {
    next(error);
  }
};

const getReportAgentPerformance = async (req, res, next) => {
  try {
    const performance = await supportService.getAgentPerformance(req.companyId);
    return ApiResponse.success(res, performance);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
  replyTicket,
  assignTicket,
  changeTicketStatus,
  changeTicketPriority,
  closeTicket,
  getTicketAISummary,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReportSummary,
  getReportSLA,
  getReportAgentPerformance,
};
