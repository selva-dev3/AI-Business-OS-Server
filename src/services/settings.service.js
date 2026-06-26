const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
const EmailTemplate = require('../models/EmailTemplate');
const Integration = require('../models/Integration');
const ApiKey = require('../models/ApiKey');
const AuditLog = require('../models/AuditLog');
const Plan = require('../models/Plan');
const Company = require('../models/Company');
const Invoice = require('../models/Invoice');
const AppError = require('../utils/appError');
const { generateApiKey } = require('../utils/helpers');
const { paginateQuery, buildMeta } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');
const env = require('../config/env');
const crypto = require('crypto');

const listRoles = async (companyId) => {
  const roles = await Role.find({ companyId }).sort({ name: 1 }).lean();

  const rolesWithCount = await Promise.all(
    roles.map(async (role) => {
      const userCount = await User.countDocuments({ roleId: role._id, companyId });
      return { ...role, userCount };
    })
  );

  return rolesWithCount;
};

const createRole = async (companyId, data) => {
  const existing = await Role.findOne({ companyId, name: data.name });
  if (existing) throw new AppError(409, 'CONFLICT', 'Role with this name already exists');

  const role = await Role.create({ ...data, companyId, isSystem: false });
  return role;
};

const getRoleById = async (companyId, roleId) => {
  const role = await Role.findOne({ _id: roleId, companyId });
  if (!role) throw new AppError(404, 'NOT_FOUND', 'Role not found');
  return role;
};

const updateRole = async (companyId, roleId, data) => {
  const role = await Role.findOne({ _id: roleId, companyId });
  if (!role) throw new AppError(404, 'NOT_FOUND', 'Role not found');
  if (role.isSystem) throw new AppError(400, 'BAD_REQUEST', 'System roles cannot be modified');

  Object.assign(role, data);
  await role.save();
  return role;
};

const removeRole = async (companyId, roleId) => {
  const role = await Role.findOne({ _id: roleId, companyId });
  if (!role) throw new AppError(404, 'NOT_FOUND', 'Role not found');
  if (role.isSystem) throw new AppError(400, 'BAD_REQUEST', 'System roles cannot be deleted');

  const activeUsers = await User.countDocuments({ roleId, companyId, isActive: true });
  if (activeUsers > 0) {
    throw new AppError(400, 'BAD_REQUEST', 'Cannot delete role with active users. Reassign users first.');
  }

  await Role.deleteOne({ _id: roleId });
  return { success: true };
};

const listPermissions = async () => {
  const permissions = await Permission.find().sort({ module: 1, action: 1 }).lean();

  const grouped = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {});

  return grouped;
};

const getEmailSettings = async (companyId) => {
  const settings = {
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    user: env.smtp.user,
    from: env.smtp.from,
    pass: env.smtp.pass ? '********' : '',
  };
  return settings;
};

const updateEmailSettings = async (companyId, data) => {
  const updates = {};
  if (data.host) env.smtp.host = data.host;
  if (data.port) env.smtp.port = data.port;
  if (data.secure !== undefined) env.smtp.secure = data.secure;
  if (data.user) env.smtp.user = data.user;
  if (data.pass) env.smtp.pass = data.pass;
  if (data.from) env.smtp.from = data.from;

  return { success: true, message: 'Email settings updated. They will apply after server restart.' };
};

const testEmail = async (data) => {
  await sendEmail({
    to: data.to,
    subject: 'Test Email from AI Business OS',
    html: '<h1>Test Email</h1><p>This is a test email from AI Business OS. If you received this, your email configuration is working correctly.</p>',
  });
  return { success: true, message: 'Test email sent successfully' };
};

const listTemplates = async (companyId) => {
  const templates = await EmailTemplate.find({ companyId }).sort({ type: 1 });
  return templates;
};

const updateTemplate = async (companyId, type, data) => {
  const template = await EmailTemplate.findOneAndUpdate(
    { companyId, type },
    { ...data, isCustomized: true },
    { new: true, runValidators: true, upsert: true }
  );
  return template;
};

const listIntegrations = async (companyId) => {
  const integrations = await Integration.find({ companyId });
  return integrations;
};

const connectIntegration = async (companyId, type, data) => {
  const integrationData = {
    companyId,
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    config: data,
    isConnected: true,
    connectedAt: new Date(),
  };

  const integration = await Integration.findOneAndUpdate(
    { companyId, type },
    integrationData,
    { new: true, runValidators: true, upsert: true }
  );
  return integration;
};

const disconnectIntegration = async (companyId, type) => {
  const integration = await Integration.findOne({ companyId, type });
  if (!integration) throw new AppError(404, 'NOT_FOUND', 'Integration not found');

  integration.isConnected = false;
  integration.connectedAt = null;
  await integration.save();
  return { success: true };
};

const listApiKeys = async (companyId) => {
  const keys = await ApiKey.find({ companyId }).sort({ createdAt: -1 });
  return keys;
};

const createApiKey = async (companyId, data) => {
  const key = generateApiKey();
  const keyPreview = key.slice(0, 12) + '...' + key.slice(-4);

  const apiKey = await ApiKey.create({
    companyId,
    name: data.name,
    key,
    keyPreview,
    expiresAt: data.expiresAt || null,
    permissions: data.permissions || [],
  });
  return apiKey;
};

const removeApiKey = async (companyId, keyId) => {
  const key = await ApiKey.findOneAndDelete({ _id: keyId, companyId });
  if (!key) throw new AppError(404, 'NOT_FOUND', 'API key not found');
  return { success: true };
};

const listAuditLogs = async (companyId, query = {}) => {
  const { page, limit, skip } = paginateQuery(query.page, query.limit);
  const filter = { companyId };

  if (query.module) filter.module = query.module;
  if (query.action) filter.action = query.action;
  if (query.userId) filter.userId = query.userId;
  if (query.entityType) filter.entityType = query.entityType;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const [data, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email'),
    AuditLog.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const exportAuditLogs = async (companyId, query = {}) => {
  const filter = { companyId };
  if (query.module) filter.module = query.module;
  if (query.action) filter.action = query.action;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const logs = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName email')
    .lean();

  return logs.map((log) => ({
    timestamp: log.createdAt,
    user: log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown',
    email: log.userId?.email || '',
    action: log.action,
    module: log.module,
    entityType: log.entityType,
    entityId: log.entityId,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
  }));
};

const getPlan = async (companyId) => {
  const company = await Company.findById(companyId).populate('plan', 'name description price features');
  if (!company) throw new AppError(404, 'NOT_FOUND', 'Company not found');

  return {
    currentPlan: company.plan,
    validUntil: company.planValidUntil,
    isActive: company.isActive,
  };
};

const getUsage = async (companyId) => {
  const [userCount, storageUsed, aiCreditsUsed] = await Promise.all([
    User.countDocuments({ companyId, isActive: true }),
    (async () => {
      const total = 0;
      return total;
    })(),
    (async () => {
      return { used: 0, total: 100 };
    })(),
  ]);

  return {
    users: { used: userCount },
    storage: { used: storageUsed },
    aiCredits: aiCreditsUsed,
  };
};

const getInvoices = async (companyId) => {
  const invoices = await Invoice.find({ companyId, type: 'PURCHASE' })
    .sort({ issueDate: -1 })
    .limit(12);
  return invoices;
};

const upgradePlan = async (companyId, data) => {
  const plan = await Plan.findOne({ name: data.plan, isActive: true });
  if (!plan) throw new AppError(404, 'NOT_FOUND', 'Plan not found');

  const company = await Company.findByIdAndUpdate(
    companyId,
    {
      plan: plan._id,
      planValidUntil: data.billingCycle === 'annual'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  );

  return { success: true, plan: plan.name, billingCycle: data.billingCycle };
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
