import Joi from 'joi';

export const adminSignupValidation = Joi.object({
  adminName: Joi.string().min(3).required().messages({
    'string.empty': ' name is required',
    'string.min': ' name should have a minimum length of 3',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  password: Joi.string()
    .trim() 
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]).{6,}$'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.pattern.base': 'Password must be at least 6 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    }),
  role: Joi.string().valid('superadmin', 'admin', 'subadmin').optional(),
});

export const adminLoginValidationSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Password is required",
    }),
});