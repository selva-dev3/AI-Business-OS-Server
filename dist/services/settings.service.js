"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradePlan = exports.getInvoices = exports.getUsage = exports.getPlan = exports.exportAuditLogs = exports.listAuditLogs = exports.removeApiKey = exports.createApiKey = exports.listApiKeys = exports.disconnectIntegration = exports.connectIntegration = exports.listIntegrations = exports.updateTemplate = exports.listTemplates = exports.testEmail = exports.updateEmailSettings = exports.getEmailSettings = exports.listPermissions = exports.removeRole = exports.updateRole = exports.getRoleById = exports.createRole = exports.listRoles = void 0;
const Role_1 = __importDefault(require("../models/Role"));
const Permission_1 = __importDefault(require("../models/Permission"));
const User_1 = __importDefault(require("../models/User"));
const EmailTemplate_1 = __importDefault(require("../models/EmailTemplate"));
const Integration_1 = __importDefault(require("../models/Integration"));
const ApiKey_1 = __importDefault(require("../models/ApiKey"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const Plan_1 = __importDefault(require("../models/Plan"));
const Company_1 = __importDefault(require("../models/Company"));
const Invoice_1 = __importDefault(require("../models/Invoice"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const emailService_1 = require("../utils/emailService");
const env_1 = __importDefault(require("../config/env"));
const listRoles = async (companyId) => {
    const roles = await Role_1.default.find({ companyId }).sort({ name: 1 }).lean();
    const rolesWithCount = await Promise.all(roles.map(async (role) => {
        const userCount = await User_1.default.countDocuments({ roleId: role._id, companyId });
        return { ...role, userCount };
    }));
    return rolesWithCount;
};
exports.listRoles = listRoles;
const createRole = async (companyId, data) => {
    const existing = await Role_1.default.findOne({ companyId, name: data.name });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Role with this name already exists');
    const role = await Role_1.default.create({ ...data, companyId, isSystem: false });
    return role;
};
exports.createRole = createRole;
const getRoleById = async (companyId, roleId) => {
    const role = await Role_1.default.findOne({ _id: roleId, companyId });
    if (!role)
        throw new appError_1.default(404, 'NOT_FOUND', 'Role not found');
    return role;
};
exports.getRoleById = getRoleById;
const updateRole = async (companyId, roleId, data) => {
    const role = await Role_1.default.findOne({ _id: roleId, companyId });
    if (!role)
        throw new appError_1.default(404, 'NOT_FOUND', 'Role not found');
    if (role.isSystem)
        throw new appError_1.default(400, 'BAD_REQUEST', 'System roles cannot be modified');
    Object.assign(role, data);
    await role.save();
    return role;
};
exports.updateRole = updateRole;
const removeRole = async (companyId, roleId) => {
    const role = await Role_1.default.findOne({ _id: roleId, companyId });
    if (!role)
        throw new appError_1.default(404, 'NOT_FOUND', 'Role not found');
    if (role.isSystem)
        throw new appError_1.default(400, 'BAD_REQUEST', 'System roles cannot be deleted');
    const activeUsers = await User_1.default.countDocuments({ roleId, companyId, isActive: true });
    if (activeUsers > 0) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Cannot delete role with active users. Reassign users first.');
    }
    await Role_1.default.deleteOne({ _id: roleId });
    return { success: true };
};
exports.removeRole = removeRole;
const listPermissions = async () => {
    const permissions = await Permission_1.default.find().sort({ module: 1, action: 1 }).lean();
    const grouped = permissions.reduce((acc, p) => {
        const mod = p.module;
        if (!acc[mod])
            acc[mod] = [];
        acc[mod].push(p);
        return acc;
    }, {});
    return grouped;
};
exports.listPermissions = listPermissions;
const getEmailSettings = async (_companyId) => {
    const settings = {
        host: env_1.default.smtp.host,
        port: env_1.default.smtp.port,
        secure: env_1.default.smtp.secure,
        user: env_1.default.smtp.user,
        from: env_1.default.smtp.from,
        pass: env_1.default.smtp.pass ? '********' : '',
    };
    return settings;
};
exports.getEmailSettings = getEmailSettings;
const updateEmailSettings = async (_companyId, data) => {
    if (data.host)
        env_1.default.smtp.host = data.host;
    if (data.port)
        env_1.default.smtp.port = data.port;
    if (data.secure !== undefined)
        env_1.default.smtp.secure = data.secure;
    if (data.user)
        env_1.default.smtp.user = data.user;
    if (data.pass)
        env_1.default.smtp.pass = data.pass;
    if (data.from)
        env_1.default.smtp.from = data.from;
    return { success: true, message: 'Email settings updated. They will apply after server restart.' };
};
exports.updateEmailSettings = updateEmailSettings;
const testEmail = async (data) => {
    await (0, emailService_1.sendEmail)({
        to: data.to,
        subject: 'Test Email from AI Business OS',
        html: '<h1>Test Email</h1><p>This is a test email from AI Business OS. If you received this, your email configuration is working correctly.</p>',
    });
    return { success: true, message: 'Test email sent successfully' };
};
exports.testEmail = testEmail;
const listTemplates = async (companyId) => {
    const templates = await EmailTemplate_1.default.find({ companyId }).sort({ type: 1 });
    return templates;
};
exports.listTemplates = listTemplates;
const updateTemplate = async (companyId, type, data) => {
    const template = await EmailTemplate_1.default.findOneAndUpdate({ companyId, type }, { ...data, isCustomized: true }, { new: true, runValidators: true, upsert: true });
    return template;
};
exports.updateTemplate = updateTemplate;
const listIntegrations = async (companyId) => {
    const integrations = await Integration_1.default.find({ companyId });
    return integrations;
};
exports.listIntegrations = listIntegrations;
const connectIntegration = async (companyId, type, data) => {
    const integrationData = {
        companyId,
        type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        config: data,
        isConnected: true,
        connectedAt: new Date(),
    };
    const integration = await Integration_1.default.findOneAndUpdate({ companyId, type }, integrationData, { new: true, runValidators: true, upsert: true });
    return integration;
};
exports.connectIntegration = connectIntegration;
const disconnectIntegration = async (companyId, type) => {
    const integration = await Integration_1.default.findOne({ companyId, type });
    if (!integration)
        throw new appError_1.default(404, 'NOT_FOUND', 'Integration not found');
    integration.isConnected = false;
    integration.connectedAt = null;
    await integration.save();
    return { success: true };
};
exports.disconnectIntegration = disconnectIntegration;
const listApiKeys = async (companyId) => {
    const keys = await ApiKey_1.default.find({ companyId }).sort({ createdAt: -1 });
    return keys;
};
exports.listApiKeys = listApiKeys;
const createApiKey = async (companyId, data) => {
    const key = (0, helpers_1.generateApiKey)();
    const keyPreview = key.slice(0, 12) + '...' + key.slice(-4);
    const apiKey = await ApiKey_1.default.create({
        companyId,
        name: data.name,
        key,
        keyPreview,
        expiresAt: data.expiresAt || null,
        permissions: data.permissions || [],
    });
    return apiKey;
};
exports.createApiKey = createApiKey;
const removeApiKey = async (companyId, keyId) => {
    const key = await ApiKey_1.default.findOneAndDelete({ _id: keyId, companyId });
    if (!key)
        throw new appError_1.default(404, 'NOT_FOUND', 'API key not found');
    return { success: true };
};
exports.removeApiKey = removeApiKey;
const listAuditLogs = async (companyId, query = {}) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.module)
        filter.module = query.module;
    if (query.action)
        filter.action = query.action;
    if (query.userId)
        filter.userId = query.userId;
    if (query.entityType)
        filter.entityType = query.entityType;
    if (query.from || query.to) {
        filter.createdAt = {};
        if (query.from)
            filter.createdAt.$gte = new Date(query.from);
        if (query.to)
            filter.createdAt.$lte = new Date(query.to);
    }
    const [data, total] = await Promise.all([
        AuditLog_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName email'),
        AuditLog_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.listAuditLogs = listAuditLogs;
const exportAuditLogs = async (companyId, query = {}) => {
    const filter = { companyId };
    if (query.module)
        filter.module = query.module;
    if (query.action)
        filter.action = query.action;
    if (query.from || query.to) {
        filter.createdAt = {};
        if (query.from)
            filter.createdAt.$gte = new Date(query.from);
        if (query.to)
            filter.createdAt.$lte = new Date(query.to);
    }
    const logs = await AuditLog_1.default.find(filter)
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
exports.exportAuditLogs = exportAuditLogs;
const getPlan = async (companyId) => {
    const company = await Company_1.default.findById(companyId).populate('plan', 'name description price features');
    if (!company)
        throw new appError_1.default(404, 'NOT_FOUND', 'Company not found');
    return {
        currentPlan: company.plan,
        validUntil: company.planValidUntil,
        isActive: company.isActive,
    };
};
exports.getPlan = getPlan;
const getUsage = async (companyId) => {
    const [userCount] = await Promise.all([
        User_1.default.countDocuments({ companyId, isActive: true }),
    ]);
    return {
        users: { used: userCount },
        storage: { used: 0 },
        aiCredits: { used: 0, total: 100 },
    };
};
exports.getUsage = getUsage;
const getInvoices = async (companyId) => {
    const invoices = await Invoice_1.default.find({ companyId, type: 'PURCHASE' })
        .sort({ issueDate: -1 })
        .limit(12);
    return invoices;
};
exports.getInvoices = getInvoices;
const upgradePlan = async (companyId, data) => {
    const plan = await Plan_1.default.findOne({ name: data.plan, isActive: true });
    if (!plan)
        throw new appError_1.default(404, 'NOT_FOUND', 'Plan not found');
    const company = await Company_1.default.findByIdAndUpdate(companyId, {
        plan: plan._id,
        planValidUntil: data.billingCycle === 'annual'
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }, { new: true });
    void company;
    return { success: true, plan: plan.name, billingCycle: data.billingCycle };
};
exports.upgradePlan = upgradePlan;
//# sourceMappingURL=settings.service.js.map