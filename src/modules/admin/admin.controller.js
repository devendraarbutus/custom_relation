import adminService from './admin.service.js';
import { adminSignupValidation , adminLoginValidationSchema } from '../../validation/admin.validation.js';
import { sendResponse } from '../../utils/response.js';

export default {
    adminSignup: async (req, res, next) => {
        try {
            const { error } = adminSignupValidation.validate(req.body);
            if (error) {
                return next({ statusCode: 400, message: error.details[0].message });
            }

            const admin = await adminService.adminSignupService(req.body);
            sendResponse(res, 201, 'Admin created successfully', admin);

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
      const { adminName, email} = req.body;
      const identifier = adminName || email;
      const token = await adminService.adminLoginService(identifier, req.body.password);
      sendResponse(res, 200, 'Login successful', {token});
    } catch (err) {
      next(err);
    }
  },
  getAdmins: async (req, res, next) => {
    try {
      const role = req.admin.role;

      let roleFilter = [];
      if (role === 'superadmin') {
        // Superadmin can see all admins and subadmins
        roleFilter = ['admin', 'subadmin'];
      } else if (role === 'admin') {
        // Admin can only see subadmins
        roleFilter = ['subadmin'];
      } else {
        return next({ statusCode: 403, message: 'Access denied. Because only admin , superadmin can do' });
      }

      const admins = await adminService.getAdminsService(roleFilter);
      sendResponse(res, 200, 'Admins fetched successfully', admins);
    } catch (err) {
      next(err);
    }
  },
}