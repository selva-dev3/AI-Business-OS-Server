import Joi from 'joi';

const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISQUALIFIED'] as const;
const dealStages = ['QUALIFICATION', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'] as const;
const activityTypes = ['CALL', 'MEETING', 'EMAIL', 'TASK', 'NOTE'] as const;
const dealStatuses = ['OPEN', 'WON', 'LOST'] as const;
const leadSources = ['WEBSITE', 'REFERRAL', 'SOCIAL', 'EMAIL', 'CALL', 'OTHER'] as const;

const objectId = Joi.string().hex().length(24);
const optionalObjectId = objectId.allow(null, '');

export const createLeadSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().allow('', null).default(''),
  lastName: Joi.string().allow('', null).default(''),
  email: Joi.string().email().allow('', null).default(''),
  phone: Joi.string().allow('', null).default(''),
  company: Joi.string().allow('', null).default(''),
  jobTitle: Joi.string().allow('', null).default(''),
  source: Joi.string().valid(...leadSources).default('OTHER'),
  ownerId: optionalObjectId.default(null),
  notes: Joi.string().allow('', null).default(''),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  customFields: Joi.object().default({}),
});

export const updateLeadSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string(),
  firstName: Joi.string().allow('', null),
  lastName: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().allow('', null),
  company: Joi.string().allow('', null),
  jobTitle: Joi.string().allow('', null),
  source: Joi.string().valid(...leadSources),
  status: Joi.string().valid(...leadStatuses),
  score: Joi.number().min(0),
  ownerId: optionalObjectId,
  notes: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string().trim()),
  customFields: Joi.object(),
}).min(1);

export const changeLeadStageSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string().valid(...leadStatuses).required(),
});

export const convertLeadSchema: Joi.ObjectSchema = Joi.object({
  dealTitle: Joi.string().required(),
  dealValue: Joi.number().min(0).default(0),
  expectedCloseDate: Joi.date().allow(null).default(null),
  accountId: optionalObjectId.default(null),
  createContact: Joi.boolean().default(false),
});

export const createActivitySchema: Joi.ObjectSchema = Joi.object({
  type: Joi.string().valid(...activityTypes).required(),
  subject: Joi.string().allow('', null).default(''),
  description: Joi.string().allow('', null).default(''),
  outcome: Joi.string().allow('', null).default(''),
  scheduledAt: Joi.date().allow(null).default(null),
  completedAt: Joi.date().allow(null).default(null),
  dueAt: Joi.date().allow(null).default(null),
  leadId: optionalObjectId.default(null),
  dealId: optionalObjectId.default(null),
  contactId: optionalObjectId.default(null),
  assignedToId: optionalObjectId.default(null),
});

export const updateActivitySchema: Joi.ObjectSchema = Joi.object({
  type: Joi.string().valid(...activityTypes),
  subject: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  outcome: Joi.string().allow('', null),
  isCompleted: Joi.boolean(),
  scheduledAt: Joi.date().allow(null),
  completedAt: Joi.date().allow(null),
  dueAt: Joi.date().allow(null),
  leadId: optionalObjectId,
  dealId: optionalObjectId,
  contactId: optionalObjectId,
  assignedToId: optionalObjectId,
}).min(1);

export const createContactSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().allow('', null).default(''),
  email: Joi.string().email().allow('', null).default(''),
  phone: Joi.string().allow('', null).default(''),
  mobile: Joi.string().allow('', null).default(''),
  jobTitle: Joi.string().allow('', null).default(''),
  department: Joi.string().allow('', null).default(''),
  accountId: optionalObjectId.default(null),
  isPrimary: Joi.boolean().default(false),
  address: Joi.object({
    street: Joi.string().allow('', null).default(''),
    city: Joi.string().allow('', null).default(''),
    state: Joi.string().allow('', null).default(''),
    country: Joi.string().allow('', null).default(''),
    zip: Joi.string().allow('', null).default(''),
  }).default({}),
  socialLinks: Joi.object({
    linkedin: Joi.string().allow('', null).default(''),
    twitter: Joi.string().allow('', null).default(''),
  }).default({}),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  notes: Joi.string().allow('', null).default(''),
  ownerId: optionalObjectId.default(null),
});

export const updateContactSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().allow('', null),
  mobile: Joi.string().allow('', null),
  jobTitle: Joi.string().allow('', null),
  department: Joi.string().allow('', null),
  accountId: optionalObjectId,
  isPrimary: Joi.boolean(),
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
    zip: Joi.string().allow('', null),
  }),
  socialLinks: Joi.object({
    linkedin: Joi.string().allow('', null),
    twitter: Joi.string().allow('', null),
  }),
  tags: Joi.array().items(Joi.string().trim()),
  notes: Joi.string().allow('', null),
  ownerId: optionalObjectId,
}).min(1);

export const mergeContactsSchema: Joi.ObjectSchema = Joi.object({
  primaryContactId: objectId.required(),
  duplicateContactIds: Joi.array().items(objectId).min(1).required(),
});

export const createAccountSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  website: Joi.string().uri().allow('', null).default(''),
  industry: Joi.string().allow('', null).default(''),
  size: Joi.string().allow('', null).default(''),
  revenue: Joi.number().min(0).default(0),
  phone: Joi.string().allow('', null).default(''),
  email: Joi.string().email().allow('', null).default(''),
  address: Joi.object({
    street: Joi.string().allow('', null).default(''),
    city: Joi.string().allow('', null).default(''),
    state: Joi.string().allow('', null).default(''),
    country: Joi.string().allow('', null).default(''),
    zip: Joi.string().allow('', null).default(''),
  }).default({}),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  ownerId: optionalObjectId.default(null),
});

export const updateAccountSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string(),
  website: Joi.string().uri().allow('', null),
  industry: Joi.string().allow('', null),
  size: Joi.string().allow('', null),
  revenue: Joi.number().min(0),
  phone: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
    zip: Joi.string().allow('', null),
  }),
  tags: Joi.array().items(Joi.string().trim()),
  ownerId: optionalObjectId,
}).min(1);

export const createDealSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string().required(),
  value: Joi.number().min(0).default(0),
  currency: Joi.string().default('INR'),
  accountId: optionalObjectId.default(null),
  stage: Joi.string().valid(...dealStages).default('QUALIFICATION'),
  probability: Joi.number().min(0).max(100).default(0),
  expectedCloseDate: Joi.date().allow(null).default(null),
  ownerId: optionalObjectId.default(null),
  leadId: optionalObjectId.default(null),
  notes: Joi.string().allow('', null).default(''),
  tags: Joi.array().items(Joi.string().trim()).default([]),
});

export const updateDealSchema: Joi.ObjectSchema = Joi.object({
  title: Joi.string(),
  value: Joi.number().min(0),
  currency: Joi.string(),
  accountId: optionalObjectId,
  stage: Joi.string().valid(...dealStages),
  probability: Joi.number().min(0).max(100),
  expectedCloseDate: Joi.date().allow(null),
  ownerId: optionalObjectId,
  leadId: optionalObjectId,
  notes: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid(...dealStatuses),
}).min(1);

export const changeDealStageSchema: Joi.ObjectSchema = Joi.object({
  stage: Joi.string().valid(...dealStages).required(),
});

export const closeWonDealSchema: Joi.ObjectSchema = Joi.object({
  actualCloseDate: Joi.date().allow(null).default(null),
  finalValue: Joi.number().min(0).default(0),
  notes: Joi.string().allow('', null).default(''),
});

export const closeLostDealSchema: Joi.ObjectSchema = Joi.object({
  reason: Joi.string().allow('', null).default(''),
  notes: Joi.string().allow('', null).default(''),
});

export const reorderPipelineSchema: Joi.ObjectSchema = Joi.object({
  dealId: objectId.required(),
  stage: Joi.string().valid(...dealStages).required(),
  position: Joi.number().min(0).required(),
});
