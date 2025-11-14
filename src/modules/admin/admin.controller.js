import adminService from './admin.service.js';
import { adminSignupValidation, adminLoginValidationSchema } from '../../validation/admin.validation.js';
import { sendResponse } from '../../utils/response.js';

export default {
  adminSignup: async (req, res, next) => {
    try {
      const { error } = adminSignupValidation.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.details[0].message });
      }

      const result = await adminService.adminSignupService(req.body);
      sendResponse(res, 201, "Admin created successfully", result);

    } catch (err) {
      next(err);
    }
  },

  adminLogin: async (req, res, next) => {
    try {
      const { error } = adminLoginValidationSchema.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.details[0].message });
      }

      const { email, password } = req.body;
      const result = await adminService.adminLoginService(email, password);

      sendResponse(res, 200, "Login successful", result);
    } catch (err) {
      next(err);
    }
  },

  getAdmins: async (req, res, next) => {
    try {
      let { page = 1, limit = 10, search = "" } = req.query;
      page = Number(page);
      limit = Number(limit);

      const role = req.admin.role;

      // Filter allowed data
      let roleFilter = [];
      if (role === "superadmin") roleFilter = ["admin", "subadmin", "superadmin"];
      else if (role === "admin") roleFilter = ["subadmin"];
      else roleFilter = []; // subadmin cannot view list

      const result = await adminService.getAdminsService({
        roleFilter,
        page,
        limit,
        search
      });

      sendResponse(res, 200, "Admins fetched successfully", result);
    } catch (err) {
      next(err);
    }
  },
}