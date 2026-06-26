const Joi = require('joi');

const createFolderSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(500).allow('', null).default(''),
  parentId: Joi.string().hex().length(24).allow(null).default(null),
});

const updateFolderSchema = Joi.object({
  name: Joi.string().trim().max(200),
  description: Joi.string().trim().max(500).allow('', null),
}).min(1);

const updateDocumentSchema = Joi.object({
  name: Joi.string().trim().max(255),
  description: Joi.string().trim().max(1000).allow('', null),
  tags: Joi.array().items(Joi.string().trim()),
}).min(1);

const shareDocumentSchema = Joi.object({
  userIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  access: Joi.string().valid('VIEW', 'EDIT').default('VIEW'),
  generateLink: Joi.boolean().default(false),
});

module.exports = {
  createFolderSchema,
  updateFolderSchema,
  updateDocumentSchema,
  shareDocumentSchema,
};
