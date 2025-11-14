import employeeService from "./employee.service.js";
import {createEmployeeValidation,updateEmployeeValidation,employeeLoginValidation} from "../../validation/employee.validation.js";
import { sendResponse } from "../../utils/response.js";
export default {

    createEmployee: async (req, res, next) => {
        try {
            const { error } = createEmployeeValidation.validate(req.body);
            if (error) return next(error);

            const data = {
                ...req.body,
                createdBy: req.admin.id
            };

            const result = await employeeService.createEmployeeService(data, req.admin.role);

            res.status(201).json({
                success: true,
                message: "Employee created successfully & email sent",
                result
            });
        } catch (err) {
            next(err);
        }
    },

    getEmployees: async (req, res, next) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || "";

            const result = await employeeService.getEmployeesService({
                page,
                limit,
                search
            });

            res.status(200).json({
                success: true,
                message: "Employees fetched successfully",
                result
            });
        } catch (err) { next(err); }
    },

    getEmployeeById: async (req, res, next) => {
        try {
            const result = await employeeService.getEmployeeByIdService(req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee fetched",
                result
            });
        } catch (err) { next(err); }
    },

    updateEmployee: async (req, res, next) => {
        try {
            const { error } = updateEmployeeValidation.validate(req.body);
            if (error) return next(error);

            const result = await employeeService.updateEmployeeService(
                req.params.id,
                req.body,
                req.admin.role
            );

            res.status(200).json({
                success: true,
                message: "Employee updated successfully",
                result
            });
        } catch (err) { next(err); }
    },

    deleteEmployee: async (req, res, next) => {
        try {
            const result = await employeeService.deleteEmployeeService(
                req.params.id,
                req.admin.role
            );

            res.status(200).json({
                success: true,
                message: "Employee deleted successfully",
                result
            });
        } catch (err) { next(err); }
    },
    employeeLogin: async (req, res, next) => {
      try {
    const { error } = employeeLoginValidation.validate(req.body);
    if (error) {
      return next({ statusCode: 400, message: error.details[0].message });
    }

    const { email, password } = req.body;
    const result = await employeeService.employeeLoginService(email, password);

    sendResponse(res, 200, "Login successful", result);
  } catch (err) {
    next(err);
  }
    }
};

export default employeeController;
