declare const listRoles: (companyId: string) => Promise<any>;
declare const createRole: (companyId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Role").IRole, {}, {}> & import("../models/Role").IRole & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getRoleById: (companyId: string, roleId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Role").IRole, {}, {}> & import("../models/Role").IRole & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateRole: (companyId: string, roleId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Role").IRole, {}, {}> & import("../models/Role").IRole & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeRole: (companyId: string, roleId: string) => Promise<{
    success: boolean;
}>;
declare const listPermissions: () => Promise<Record<string, unknown[]>>;
declare const getEmailSettings: (_companyId: string) => Promise<{
    host: string;
    port: number;
    secure: boolean;
    user: string;
    from: string;
    pass: string;
}>;
declare const updateEmailSettings: (_companyId: string, data: Record<string, unknown>) => Promise<{
    success: boolean;
    message: string;
}>;
declare const testEmail: (data: Record<string, unknown>) => Promise<{
    success: boolean;
    message: string;
}>;
declare const listTemplates: (companyId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/EmailTemplate").IEmailTemplate, {}, {}> & import("../models/EmailTemplate").IEmailTemplate & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const updateTemplate: (companyId: string, type: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/EmailTemplate").IEmailTemplate, {}, {}> & import("../models/EmailTemplate").IEmailTemplate & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const listIntegrations: (companyId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Integration").IIntegration, {}, {}> & import("../models/Integration").IIntegration & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const connectIntegration: (companyId: string, type: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Integration").IIntegration, {}, {}> & import("../models/Integration").IIntegration & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const disconnectIntegration: (companyId: string, type: string) => Promise<{
    success: boolean;
}>;
declare const listApiKeys: (companyId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/ApiKey").IApiKey, {}, {}> & import("../models/ApiKey").IApiKey & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const createApiKey: (companyId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/ApiKey").IApiKey, {}, {}> & import("../models/ApiKey").IApiKey & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeApiKey: (companyId: string, keyId: string) => Promise<{
    success: boolean;
}>;
declare const listAuditLogs: (companyId: string, query?: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/AuditLog").IAuditLog, {}, {}> & import("../models/AuditLog").IAuditLog & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const exportAuditLogs: (companyId: string, query?: Record<string, unknown>) => Promise<{
    timestamp: Date;
    user: string;
    email: string;
    action: string;
    module: string;
    entityType: string;
    entityId: import("mongoose").FlattenMaps<unknown> | undefined;
    ipAddress: string | undefined;
    userAgent: string | undefined;
}[]>;
declare const getPlan: (companyId: string) => Promise<{
    currentPlan: string | undefined;
    validUntil: any;
    isActive: boolean | undefined;
}>;
declare const getUsage: (companyId: string) => Promise<{
    users: {
        used: number;
    };
    storage: {
        used: number;
    };
    aiCredits: {
        used: number;
        total: number;
    };
}>;
declare const getInvoices: (companyId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Invoice").IInvoice, {}, {}> & import("../models/Invoice").IInvoice & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const upgradePlan: (companyId: string, data: Record<string, unknown>) => Promise<{
    success: boolean;
    plan: string;
    billingCycle: unknown;
}>;
export { listRoles, createRole, getRoleById, updateRole, removeRole, listPermissions, getEmailSettings, updateEmailSettings, testEmail, listTemplates, updateTemplate, listIntegrations, connectIntegration, disconnectIntegration, listApiKeys, createApiKey, removeApiKey, listAuditLogs, exportAuditLogs, getPlan, getUsage, getInvoices, upgradePlan, };
//# sourceMappingURL=settings.service.d.ts.map