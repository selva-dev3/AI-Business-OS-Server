import Joi from 'joi';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const passwordMessage = 'Password must be at least 8 characters with uppercase, lowercase, and number';

export const registerSchema: Joi.ObjectSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  companyName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).pattern(passwordPattern).message(passwordMessage).required(),
});

export const loginSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema: Joi.ObjectSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const forgotPasswordSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

export const resetPasswordSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  otp: Joi.string().length(6).pattern(/^\d{6}$/).required(),
  newPassword: Joi.string().min(8).pattern(passwordPattern).message(passwordMessage).required(),
});

export const changePasswordSchema: Joi.ObjectSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(passwordPattern).message(passwordMessage).required(),
});
