import joi from "joi";

export const createEmployeeValidation = joi.object({
  employeeName: joi.string().min(3).max(30).required().messages({
    "string.empty": "Employee name is required",
    "string.min": "Employee name must be at least 3 characters",
    "string.max": "Employee name must be at most 30 characters",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  mobile: joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: joi.string()
    .min(6)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
});


export const updateEmployeeValidation = joi.object({
  employeeName: joi.string().min(3).max(30).optional().messages({
    "string.min": "Employee name must be at least 3 characters",
    "string.max": "Employee name must be at most 30 characters",
  }),
  email: joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),
  mobile: joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: joi.string()
    .min(6)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .optional()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
  status: joi.string().valid("active", "inactive").optional().messages({
    "any.only": "Status must be either 'active' or 'inactive'",
  }),
});

export const employeeLoginValidation = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});