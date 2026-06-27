import Joi from 'joi';

export const createFolderSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(500).allow('', null).default(''),
  parentId: Joi.string().hex().length(24).allow(null).default(null),
});

export const updateFolderSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(200),
  description: Joi.string().trim().max(500).allow('', null),
}).min(1);

export const updateDocumentSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().trim().max(255),
  description: Joi.string().trim().max(1000).allow('', null),
  tags: Joi.array().items(Joi.string().trim()),
}).min(1);

export const shareDocumentSchema: Joi.ObjectSchema = Joi.object({
  userIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  access: Joi.string().valid('VIEW', 'EDIT').default('VIEW'),
  generateLink: Joi.boolean().default(false),
});
