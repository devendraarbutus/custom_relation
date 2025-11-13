import employeeService from "../employee/employee.service.js";
import { employeeValidation , employeeUpdateValidation , employeeLoginValidationSchema } from "../../validation/employee.validation.js";
import { sendResponse } from "../../utils/response.js";

export default {
  createEmployee: async (req, res, next) => {
    try {
      const adminRole = req.admin.role;
      if (!['admin', 'superadmin','subadmin'].includes(adminRole)) {
        return next({ statusCode: 403, message: 'Access denied. Only admin or superadmin can create employees.' });
      }

      const { error } = employeeValidation.validate(req.body);
      if (error) return next({ statusCode: 400, message: error.details[0].message });
      const employeeData = { ...req.body, createdBy: req.admin.id };
      const employee = await employeeService.createEmployeeService(employeeData);

      sendResponse(res, 201, 'Employee created successfully', employee);
    } catch (err) {
      next(err);
    }
  },
  updateEmployee: async (req, res, next) => {
    try {
      const adminRole = req.admin.role;
      if (!['admin', 'superadmin'].includes(adminRole)) {
        return next({ statusCode: 403, message: 'Access denied. Only admin or superadmin or subadmin can update employees.' });
      }

      const { error } = employeeUpdateValidation.validate(req.body);
      if (error) return next({ statusCode: 400, message: error.details[0].message });

      // Update employee
      const updatedEmployee = await employeeService.updateEmployeeService(req.params.id, req.body);
      sendResponse(res, 200, 'Employee updated successfully', updatedEmployee);

    } catch (err) {
      next(err);
    }
  },
  deleteEmployee: async (req, res, next) => {
    try {
      // Role-based access
      const adminRole = req.admin.role;
      if (!['superadmin'].includes(adminRole)) {
        return next({ statusCode: 403, message: 'Access denied. Only  superadmin can delete employees.' });
      }

      await employeeService.deleteEmployeeService(req.params.id);
      sendResponse(res, 200, 'Employee deleted successfully');

    } catch (err) {
      next(err);
    }
  },
    getAllEmployees: async (req, res, next) => {
    try {
      const adminRole = req.admin.role;
      if (!['admin','superadmin'].includes(adminRole)) {
        return next({ statusCode: 403, message: 'Access denied. Only  superadmin and admin can access the employees.' });
      }
      const employees = await employeeService.getAllEmployeesService();
      sendResponse(res, 200, 'Employees fetched successfully', employees);
    } catch (err) {
      next(err);
    }
  },

  getEmployeeById: async (req, res, next) => {
    try {
      const adminRole = req.admin.role;
      if (!['admin','superadmin'].includes(adminRole)) {
        return next({ statusCode: 403, message: 'Access denied. Only  superadmin and admin can access the employees.' });
      }
      const employee = await employeeService.getEmployeeByIdService(req.params.id);
      sendResponse(res, 200, 'Employee fetched successfully', employee);
    } catch (err) {
      next(err);
    }
  },
  employeeLogin: async (req, res, next) => {
    try {
      const { error } = employeeLoginValidationSchema.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.details[0].message });
      }

      const { email, password } = req.body;
      const result = await employeeService.employeeLoginService(email, password);

      sendResponse(res, 200, 'Login successful', result);
    } catch (err) {
      next(err);
    }
  },

}