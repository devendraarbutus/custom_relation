import adminService from './admin.service.js';
import { adminSignupValidation, adminLoginValidationSchema } from '../../validation/admin.validation.js';
import { sendResponse } from '../../utils/response.js';
import Admin from '../../models/admin.model.js';
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
  sendEmployeeReport: async (req, res, next) => {
    try {
      const adminId = req.admin.id;
      const admin = await Admin.findById(adminId).select("email");
      const format = req.params.format?.toLowerCase(); 

      if (!format || !["pdf", "csv", "xls"].includes(format)) {
        return next({ statusCode: 400, message: "Invalid format. Use pdf, csv, or xls" });
      }

      const result = await adminService.sendEmployeeReportService(admin.email, format);
      sendResponse(res, 200, result.message);

    } catch (err) {
      next(err);
    }
  }
}