const Joi = require('joi');

const inviteUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  roleId: Joi.string().hex().length(24).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phone: Joi.string().trim().max(20).allow(null, ''),
  isActive: Joi.boolean(),
}).min(1);

const changeRoleSchema = Joi.object({
  roleId: Joi.string().hex().length(24).required(),
});

const resetUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).max(128).required(),
  sendEmail: Joi.boolean().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phone: Joi.string().trim().max(20).allow(null, ''),
}).min(1);

module.exports = {
  inviteUserSchema,
  updateUserSchema,
  changeRoleSchema,
  resetUserPasswordSchema,
  updateProfileSchema,
};
