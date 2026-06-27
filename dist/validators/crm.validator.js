"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderPipelineSchema = exports.closeLostDealSchema = exports.closeWonDealSchema = exports.changeDealStageSchema = exports.updateDealSchema = exports.createDealSchema = exports.updateAccountSchema = exports.createAccountSchema = exports.mergeContactsSchema = exports.updateContactSchema = exports.createContactSchema = exports.updateActivitySchema = exports.createActivitySchema = exports.convertLeadSchema = exports.changeLeadStageSchema = exports.updateLeadSchema = exports.createLeadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISQUALIFIED'];
const dealStages = ['QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
const activityTypes = ['CALL', 'MEETING', 'EMAIL', 'TASK', 'NOTE'];
const dealStatuses = ['OPEN', 'WON', 'LOST'];
const leadSources = ['WEBSITE', 'REFERRAL', 'SOCIAL', 'EMAIL', 'CALL', 'OTHER'];
const objectId = joi_1.default.string().hex().length(24);
const optionalObjectId = objectId.allow(null, '');
exports.createLeadSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    firstName: joi_1.default.string().allow('', null).default(''),
    lastName: joi_1.default.string().allow('', null).default(''),
    email: joi_1.default.string().email().allow('', null).default(''),
    phone: joi_1.default.string().allow('', null).default(''),
    company: joi_1.default.string().allow('', null).default(''),
    jobTitle: joi_1.default.string().allow('', null).default(''),
    source: joi_1.default.string().valid(...leadSources).default('OTHER'),
    ownerId: optionalObjectId.default(null),
    notes: joi_1.default.string().allow('', null).default(''),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
    customFields: joi_1.default.object().default({}),
});
exports.updateLeadSchema = joi_1.default.object({
    title: joi_1.default.string(),
    firstName: joi_1.default.string().allow('', null),
    lastName: joi_1.default.string().allow('', null),
    email: joi_1.default.string().email().allow('', null),
    phone: joi_1.default.string().allow('', null),
    company: joi_1.default.string().allow('', null),
    jobTitle: joi_1.default.string().allow('', null),
    source: joi_1.default.string().valid(...leadSources),
    status: joi_1.default.string().valid(...leadStatuses),
    score: joi_1.default.number().min(0),
    ownerId: optionalObjectId,
    notes: joi_1.default.string().allow('', null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    customFields: joi_1.default.object(),
}).min(1);
exports.changeLeadStageSchema = joi_1.default.object({
    status: joi_1.default.string().valid(...leadStatuses).required(),
});
exports.convertLeadSchema = joi_1.default.object({
    dealTitle: joi_1.default.string().required(),
    dealValue: joi_1.default.number().min(0).default(0),
    expectedCloseDate: joi_1.default.date().allow(null).default(null),
    accountId: optionalObjectId.default(null),
    createContact: joi_1.default.boolean().default(false),
});
exports.createActivitySchema = joi_1.default.object({
    type: joi_1.default.string().valid(...activityTypes).required(),
    subject: joi_1.default.string().allow('', null).default(''),
    description: joi_1.default.string().allow('', null).default(''),
    outcome: joi_1.default.string().allow('', null).default(''),
    scheduledAt: joi_1.default.date().allow(null).default(null),
    completedAt: joi_1.default.date().allow(null).default(null),
    dueAt: joi_1.default.date().allow(null).default(null),
    leadId: optionalObjectId.default(null),
    dealId: optionalObjectId.default(null),
    contactId: optionalObjectId.default(null),
    assignedToId: optionalObjectId.default(null),
});
exports.updateActivitySchema = joi_1.default.object({
    type: joi_1.default.string().valid(...activityTypes),
    subject: joi_1.default.string().allow('', null),
    description: joi_1.default.string().allow('', null),
    outcome: joi_1.default.string().allow('', null),
    isCompleted: joi_1.default.boolean(),
    scheduledAt: joi_1.default.date().allow(null),
    completedAt: joi_1.default.date().allow(null),
    dueAt: joi_1.default.date().allow(null),
    leadId: optionalObjectId,
    dealId: optionalObjectId,
    contactId: optionalObjectId,
    assignedToId: optionalObjectId,
}).min(1);
exports.createContactSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().allow('', null).default(''),
    email: joi_1.default.string().email().allow('', null).default(''),
    phone: joi_1.default.string().allow('', null).default(''),
    mobile: joi_1.default.string().allow('', null).default(''),
    jobTitle: joi_1.default.string().allow('', null).default(''),
    department: joi_1.default.string().allow('', null).default(''),
    accountId: optionalObjectId.default(null),
    isPrimary: joi_1.default.boolean().default(false),
    address: joi_1.default.object({
        street: joi_1.default.string().allow('', null).default(''),
        city: joi_1.default.string().allow('', null).default(''),
        state: joi_1.default.string().allow('', null).default(''),
        country: joi_1.default.string().allow('', null).default(''),
        zip: joi_1.default.string().allow('', null).default(''),
    }).default({}),
    socialLinks: joi_1.default.object({
        linkedin: joi_1.default.string().allow('', null).default(''),
        twitter: joi_1.default.string().allow('', null).default(''),
    }).default({}),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
    notes: joi_1.default.string().allow('', null).default(''),
    ownerId: optionalObjectId.default(null),
});
exports.updateContactSchema = joi_1.default.object({
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string().allow('', null),
    email: joi_1.default.string().email().allow('', null),
    phone: joi_1.default.string().allow('', null),
    mobile: joi_1.default.string().allow('', null),
    jobTitle: joi_1.default.string().allow('', null),
    department: joi_1.default.string().allow('', null),
    accountId: optionalObjectId,
    isPrimary: joi_1.default.boolean(),
    address: joi_1.default.object({
        street: joi_1.default.string().allow('', null),
        city: joi_1.default.string().allow('', null),
        state: joi_1.default.string().allow('', null),
        country: joi_1.default.string().allow('', null),
        zip: joi_1.default.string().allow('', null),
    }),
    socialLinks: joi_1.default.object({
        linkedin: joi_1.default.string().allow('', null),
        twitter: joi_1.default.string().allow('', null),
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    notes: joi_1.default.string().allow('', null),
    ownerId: optionalObjectId,
}).min(1);
exports.mergeContactsSchema = joi_1.default.object({
    primaryContactId: objectId.required(),
    duplicateContactIds: joi_1.default.array().items(objectId).min(1).required(),
});
exports.createAccountSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    website: joi_1.default.string().uri().allow('', null).default(''),
    industry: joi_1.default.string().allow('', null).default(''),
    size: joi_1.default.string().allow('', null).default(''),
    revenue: joi_1.default.number().min(0).default(0),
    phone: joi_1.default.string().allow('', null).default(''),
    email: joi_1.default.string().email().allow('', null).default(''),
    address: joi_1.default.object({
        street: joi_1.default.string().allow('', null).default(''),
        city: joi_1.default.string().allow('', null).default(''),
        state: joi_1.default.string().allow('', null).default(''),
        country: joi_1.default.string().allow('', null).default(''),
        zip: joi_1.default.string().allow('', null).default(''),
    }).default({}),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
    ownerId: optionalObjectId.default(null),
});
exports.updateAccountSchema = joi_1.default.object({
    name: joi_1.default.string(),
    website: joi_1.default.string().uri().allow('', null),
    industry: joi_1.default.string().allow('', null),
    size: joi_1.default.string().allow('', null),
    revenue: joi_1.default.number().min(0),
    phone: joi_1.default.string().allow('', null),
    email: joi_1.default.string().email().allow('', null),
    address: joi_1.default.object({
        street: joi_1.default.string().allow('', null),
        city: joi_1.default.string().allow('', null),
        state: joi_1.default.string().allow('', null),
        country: joi_1.default.string().allow('', null),
        zip: joi_1.default.string().allow('', null),
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    ownerId: optionalObjectId,
}).min(1);
exports.createDealSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    value: joi_1.default.number().min(0).default(0),
    currency: joi_1.default.string().default('INR'),
    accountId: optionalObjectId.default(null),
    stage: joi_1.default.string().valid(...dealStages).default('QUALIFICATION'),
    probability: joi_1.default.number().min(0).max(100).default(0),
    expectedCloseDate: joi_1.default.date().allow(null).default(null),
    ownerId: optionalObjectId.default(null),
    leadId: optionalObjectId.default(null),
    notes: joi_1.default.string().allow('', null).default(''),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).default([]),
});
exports.updateDealSchema = joi_1.default.object({
    title: joi_1.default.string(),
    value: joi_1.default.number().min(0),
    currency: joi_1.default.string(),
    accountId: optionalObjectId,
    stage: joi_1.default.string().valid(...dealStages),
    probability: joi_1.default.number().min(0).max(100),
    expectedCloseDate: joi_1.default.date().allow(null),
    ownerId: optionalObjectId,
    leadId: optionalObjectId,
    notes: joi_1.default.string().allow('', null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()),
    status: joi_1.default.string().valid(...dealStatuses),
}).min(1);
exports.changeDealStageSchema = joi_1.default.object({
    stage: joi_1.default.string().valid(...dealStages).required(),
});
exports.closeWonDealSchema = joi_1.default.object({
    actualCloseDate: joi_1.default.date().allow(null).default(null),
    finalValue: joi_1.default.number().min(0).default(0),
    notes: joi_1.default.string().allow('', null).default(''),
});
exports.closeLostDealSchema = joi_1.default.object({
    reason: joi_1.default.string().allow('', null).default(''),
    notes: joi_1.default.string().allow('', null).default(''),
});
exports.reorderPipelineSchema = joi_1.default.object({
    dealId: objectId.required(),
    stage: joi_1.default.string().valid(...dealStages).required(),
    position: joi_1.default.number().min(0).required(),
});
//# sourceMappingURL=crm.validator.js.map