import Joi from 'joi';

export const createNotificationSchema: Joi.ObjectSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  type: Joi.string().trim().required(),
  title: Joi.string().trim().max(200).required(),
  message: Joi.string().trim().max(1000).allow('', null).default(''),
  link: Joi.string().uri().allow('', null).default(''),
  metadata: Joi.object().default({}),
});
