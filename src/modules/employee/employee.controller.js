// src/modules/employee/employee.controller.js
import * as employeeService from "./employee.service.js";

export const createEmployee = async (req, res, next) => {
  try {
    const employeeData = { ...req.body, createdBy: req.adminId };
    const employee = await employeeService.createEmployee(employeeData);
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json({ success: true, data: employees });
  } catch (err) {
    next(err);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.deleteEmployee(req.params.id, req.adminId);
    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    next(err);
  }
};
