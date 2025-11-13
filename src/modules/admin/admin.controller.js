import adminService from "./admin.service.js";
import {
  adminSignupValidation,
  adminLoginValidationSchema,
} from "../../validation/admin.validation.js";
import { sendResponse } from "../../utils/response.js";

/**
 * 🧩 ADMIN CONTROLLER
 * Handles signup and login requests
 */
const adminController = {
  /**
   * @route POST /api/admin/signup
   * @desc Create a new admin
   */
  adminSignup: async (req, res, next) => {
    try {
      const { error } = adminSignupValidation.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.details[0].message });
      }

      const admin = await adminService.adminSignupService(req.body);
      sendResponse(res, 201, "Admin created successfully", admin);
    } catch (err) {
      console.error("Admin signup error:", err.message);
      next(err);
    }
  },

  /**
   * @route POST /api/admin/login
   * @desc Admin login and get JWT token
   */
  adminLogin: async (req, res, next) => {
    try {
      const { error } = adminLoginValidationSchema.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.details[0].message });
      }

      const { adminName, email, password } = req.body;
      const identifier = adminName || email;

      const loginResult = await adminService.adminLoginService(identifier, password);

      sendResponse(res, 200, "Login successful", loginResult);
    } catch (err) {
      console.error("Admin login error:", err.message);
      next(err);
    }
  },
};

export default adminController;
