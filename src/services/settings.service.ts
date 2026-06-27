import Role from '../models/Role';
import Permission from '../models/Permission';
import User from '../models/User';
import EmailTemplate from '../models/EmailTemplate';
import Integration from '../models/Integration';
import ApiKey from '../models/ApiKey';
import AuditLog from '../models/AuditLog';
import Plan from '../models/Plan';
import Company from '../models/Company';
import Invoice from '../models/Invoice';
import AppError from '../utils/appError';
import { generateApiKey, paginateQuery, buildMeta } from '../utils/helpers';
import { sendEmail } from '../utils/emailService';
import env from '../config/env';

const listRoles = async (companyId: string): Promise<any> => {
  const roles = await Role.find({ companyId }).sort({ name: 1 }).lean();

  const rolesWithCount = await Promise.all(
    roles.map(async (role) => {
      const userCount = await User.countDocuments({ roleId: role._id, companyId });
      return { ...role, userCount };
    })
  );

  return rolesWithCount;
};

const createRole = async (companyId: string, data: Record<string, unknown>) => {
  const existing = await Role.findOne({ companyId, name: data.name as string });
  if (existing) throw new AppError(409, 'CONFLICT', 'Role with this name already exists');

  const role = await Role.create({ ...data, companyId, isSystem: false });
  return role;
};

const getRoleById = async (companyId: string, roleId: string) => {
  const role = await Role.findOne({ _id: roleId, companyId });
  if (!role) throw new AppError(404, 'NOT_FOUND', 'Role not found');
  return role;
};

const updateRole = async (companyId: string, roleId: string, data: Record<string, unknown>) => {
  const role = await Role.findOne({ _id: roleId, companyId });
  if (!role) throw new AppError(404, 'NOT_FOUND', 'Role not found');
  if (role.isSystem) throw new AppError(400, 'BAD_REQUEST', 'System roles cannot be modified');

  Object.assign(role, data);
  await role.save();
  return role;
};

const removeRole = async (companyId: string, roleId: string) => {
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

  const grouped = permissions.reduce((acc: Record<string, unknown[]>, p) => {
    const mod = p.module as string;
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  return grouped;
};

const getEmailSettings = async (_companyId: string) => {
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

const updateEmailSettings = async (_companyId: string, data: Record<string, unknown>) => {
  if (data.host) (env.smtp as any).host = data.host;
  if (data.port) (env.smtp as any).port = data.port;
  if (data.secure !== undefined) (env.smtp as any).secure = data.secure;
  if (data.user) (env.smtp as any).user = data.user;
  if (data.pass) (env.smtp as any).pass = data.pass;
  if (data.from) (env.smtp as any).from = data.from;

  return { success: true, message: 'Email settings updated. They will apply after server restart.' };
};

const testEmail = async (data: Record<string, unknown>) => {
  await sendEmail({
    to: data.to as string,
    subject: 'Test Email from AI Business OS',
    html: '<h1>Test Email</h1><p>This is a test email from AI Business OS. If you received this, your email configuration is working correctly.</p>',
  });
  return { success: true, message: 'Test email sent successfully' };
};

const listTemplates = async (companyId: string) => {
  const templates = await EmailTemplate.find({ companyId }).sort({ type: 1 });
  return templates;
};

const updateTemplate = async (companyId: string, type: string, data: Record<string, unknown>) => {
  const template = await EmailTemplate.findOneAndUpdate(
    { companyId, type },
    { ...data, isCustomized: true },
    { new: true, runValidators: true, upsert: true }
  );
  return template;
};

const listIntegrations = async (companyId: string) => {
  const integrations = await Integration.find({ companyId });
  return integrations;
};

const connectIntegration = async (companyId: string, type: string, data: Record<string, unknown>) => {
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

const disconnectIntegration = async (companyId: string, type: string) => {
  const integration = await Integration.findOne({ companyId, type });
  if (!integration) throw new AppError(404, 'NOT_FOUND', 'Integration not found');

  integration.isConnected = false;
  integration.connectedAt = null as any;
  await integration.save();
  return { success: true };
};

const listApiKeys = async (companyId: string) => {
  const keys = await ApiKey.find({ companyId }).sort({ createdAt: -1 });
  return keys;
};

const createApiKey = async (companyId: string, data: Record<string, unknown>) => {
  const key = generateApiKey();
  const keyPreview = key.slice(0, 12) + '...' + key.slice(-4);

  const apiKey = await ApiKey.create({
    companyId,
    name: data.name,
    key,
    keyPreview,
    expiresAt: data.expiresAt || null,
    permissions: (data.permissions as string[]) || [],
  });
  return apiKey;
};

const removeApiKey = async (companyId: string, keyId: string) => {
  const key = await ApiKey.findOneAndDelete({ _id: keyId, companyId });
  if (!key) throw new AppError(404, 'NOT_FOUND', 'API key not found');
  return { success: true };
};

const listAuditLogs = async (companyId: string, query: Record<string, unknown> = {}) => {
  const { page, limit, skip } = paginateQuery(query.page as string, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.module) filter.module = query.module;
  if (query.action) filter.action = query.action;
  if (query.userId) filter.userId = query.userId;
  if (query.entityType) filter.entityType = query.entityType;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) (filter.createdAt as Record<string, unknown>).$gte = new Date(query.from as string);
    if (query.to) (filter.createdAt as Record<string, unknown>).$lte = new Date(query.to as string);
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

const exportAuditLogs = async (companyId: string, query: Record<string, unknown> = {}) => {
  const filter: Record<string, unknown> = { companyId };
  if (query.module) filter.module = query.module;
  if (query.action) filter.action = query.action;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) (filter.createdAt as Record<string, unknown>).$gte = new Date(query.from as string);
    if (query.to) (filter.createdAt as Record<string, unknown>).$lte = new Date(query.to as string);
  }

  const logs = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName email')
    .lean();

  return logs.map((log) => ({
    timestamp: log.createdAt,
    user: log.userId ? `${(log.userId as unknown as Record<string, unknown>).firstName as string} ${(log.userId as unknown as Record<string, unknown>).lastName as string}` : 'Unknown',
    email: (log.userId as unknown as Record<string, unknown>)?.email as string || '',
    action: log.action,
    module: log.module,
    entityType: log.entityType,
    entityId: log.entityId,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
  }));
};

const getPlan = async (companyId: string) => {
  const company = await Company.findById(companyId).populate('plan', 'name description price features');
  if (!company) throw new AppError(404, 'NOT_FOUND', 'Company not found');

  return {
    currentPlan: company.plan,
    validUntil: (company as any).planValidUntil,
    isActive: company.isActive,
  };
};

const getUsage = async (companyId: string) => {
  const [userCount] = await Promise.all([
    User.countDocuments({ companyId, isActive: true }),
  ]);

  return {
    users: { used: userCount },
    storage: { used: 0 },
    aiCredits: { used: 0, total: 100 },
  };
};

const getInvoices = async (companyId: string) => {
  const invoices = await Invoice.find({ companyId, type: 'PURCHASE' })
    .sort({ issueDate: -1 })
    .limit(12);
  return invoices;
};

const upgradePlan = async (companyId: string, data: Record<string, unknown>) => {
  const plan = await Plan.findOne({ name: data.plan as string, isActive: true });
  if (!plan) throw new AppError(404, 'NOT_FOUND', 'Plan not found');

  const company = await Company.findByIdAndUpdate(
    companyId,
    {
      plan: plan._id,
      planValidUntil: (data.billingCycle as string) === 'annual'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  );
  void company;

  return { success: true, plan: plan.name, billingCycle: data.billingCycle };
};

export {
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
