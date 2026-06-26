const ApiResponse = require('../utils/apiResponse');
const settingsService = require('../services/settings.service');

const listRoles = async (req, res, next) => {
  try {
    const roles = await settingsService.listRoles(req.companyId);
    return ApiResponse.success(res, roles);
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const role = await settingsService.createRole(req.companyId, req.body);
    return ApiResponse.created(res, role);
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const role = await settingsService.getRoleById(req.companyId, req.params.id);
    return ApiResponse.success(res, role);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const role = await settingsService.updateRole(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, role);
  } catch (error) {
    next(error);
  }
};

const removeRole = async (req, res, next) => {
  try {
    const result = await settingsService.removeRole(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listPermissions = async (req, res, next) => {
  try {
    const permissions = await settingsService.listPermissions();
    return ApiResponse.success(res, permissions);
  } catch (error) {
    next(error);
  }
};

const getEmailSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getEmailSettings(req.companyId);
    return ApiResponse.success(res, settings);
  } catch (error) {
    next(error);
  }
};

const updateEmailSettings = async (req, res, next) => {
  try {
    const result = await settingsService.updateEmailSettings(req.companyId, req.body);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const testEmail = async (req, res, next) => {
  try {
    const result = await settingsService.testEmail(req.body);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listTemplates = async (req, res, next) => {
  try {
    const templates = await settingsService.listTemplates(req.companyId);
    return ApiResponse.success(res, templates);
  } catch (error) {
    next(error);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const template = await settingsService.updateTemplate(req.companyId, req.params.type, req.body);
    return ApiResponse.success(res, template);
  } catch (error) {
    next(error);
  }
};

const listIntegrations = async (req, res, next) => {
  try {
    const integrations = await settingsService.listIntegrations(req.companyId);
    return ApiResponse.success(res, integrations);
  } catch (error) {
    next(error);
  }
};

const connectIntegration = async (req, res, next) => {
  try {
    const integration = await settingsService.connectIntegration(req.companyId, req.params.type, req.body);
    return ApiResponse.success(res, integration);
  } catch (error) {
    next(error);
  }
};

const disconnectIntegration = async (req, res, next) => {
  try {
    const result = await settingsService.disconnectIntegration(req.companyId, req.params.type);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listApiKeys = async (req, res, next) => {
  try {
    const keys = await settingsService.listApiKeys(req.companyId);
    return ApiResponse.success(res, keys);
  } catch (error) {
    next(error);
  }
};

const createApiKey = async (req, res, next) => {
  try {
    const apiKey = await settingsService.createApiKey(req.companyId, req.body);
    return ApiResponse.created(res, apiKey);
  } catch (error) {
    next(error);
  }
};

const removeApiKey = async (req, res, next) => {
  try {
    const result = await settingsService.removeApiKey(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const listAuditLogs = async (req, res, next) => {
  try {
    const result = await settingsService.listAuditLogs(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const exportAuditLogs = async (req, res, next) => {
  try {
    const logs = await settingsService.exportAuditLogs(req.companyId, req.query);
    return ApiResponse.success(res, logs);
  } catch (error) {
    next(error);
  }
};

const getPlan = async (req, res, next) => {
  try {
    const plan = await settingsService.getPlan(req.companyId);
    return ApiResponse.success(res, plan);
  } catch (error) {
    next(error);
  }
};

const getUsage = async (req, res, next) => {
  try {
    const usage = await settingsService.getUsage(req.companyId);
    return ApiResponse.success(res, usage);
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const invoices = await settingsService.getInvoices(req.companyId);
    return ApiResponse.success(res, invoices);
  } catch (error) {
    next(error);
  }
};

const upgradePlan = async (req, res, next) => {
  try {
    const result = await settingsService.upgradePlan(req.companyId, req.body);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listRoles,
  createRole,
  getRoleById,
  updateRole,
  removeRole,
  listPermissions,
  getEmailSettings,
  updateEmailSettings,
  testEmail,
  listTemplates,
  updateTemplate,
  listIntegrations,
  connectIntegration,
  disconnectIntegration,
  listApiKeys,
  createApiKey,
  removeApiKey,
  listAuditLogs,
  exportAuditLogs,
  getPlan,
  getUsage,
  getInvoices,
  upgradePlan,
};
