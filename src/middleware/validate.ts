import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import ApiResponse from '../utils/apiResponse';

const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      ApiResponse.error(res, 400, 'BAD_REQUEST', messages);
      return;
    }
    req.body = value;
    next();
  };
};

const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      ApiResponse.error(res, 400, 'BAD_REQUEST', messages);
      return;
    }
    req.query = value;
    next();
  };
};

export { validate, validateQuery };
