import Joi from 'joi';

export const inviteUserSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  roleId: Joi.string().hex().length(24).required(),
});

export const updateUserSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phone: Joi.string().trim().max(20).allow(null, ''),
  isActive: Joi.boolean(),
}).min(1);

export const changeRoleSchema: Joi.ObjectSchema = Joi.object({
  roleId: Joi.string().hex().length(24).required(),
});

export const resetUserPasswordSchema: Joi.ObjectSchema = Joi.object({
  newPassword: Joi.string().min(6).max(128).required(),
  sendEmail: Joi.boolean().required(),
});

export const updateProfileSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phone: Joi.string().trim().max(20).allow(null, ''),
}).min(1);
