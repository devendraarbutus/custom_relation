import Joi from 'joi';

export const employeeValidation = Joi.object({
  employeeName: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Employee name is required',
    'string.min': 'Employee name must be at least 3 characters',
    'string.max': 'Employee name must be at most 30 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.empty': 'Mobile number is required',
    'string.pattern.base': 'Mobile number must be 10 digits',
  }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.pattern.base': 'Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special character',
    }),
});

export const employeeUpdateValidation = Joi.object({
  employeeName: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Employee name must be at least 3 characters',
    'string.max': 'Employee name must be at most 30 characters',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Invalid email format',
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Mobile number must be 10 digits',
  }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$'))
    .optional()
    .messages({
      'string.pattern.base': 'Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special character',
    }),
  status: Joi.string().valid('active', 'inactive').optional(),
});


export const employeeLoginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});