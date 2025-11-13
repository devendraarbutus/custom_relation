// src/modules/employee/employee.service.js
import Employee from "../../models/employee.model.js";

/**
 * Create a new employee
 * @param {Object} data - Employee data including name, email, and createdBy (admin ID)
 */
export const createEmployee = async (data) => {
  const { name, email, createdBy } = data;

  if (!name || !email || !createdBy) {
    const error = new Error("Name, email, and createdBy (admin) are required");
    error.statusCode = 400;
    throw error;
  }

  const existing = await Employee.findOne({ email });
  if (existing) {
    const error = new Error("Employee with this email already exists");
    error.statusCode = 400;
    throw error;
  }

  return Employee.create({ name, email, createdBy });
};

/**
 * Get all employees
 */
export const getAllEmployees = async () => {
  return Employee.find();
};

/**
 * Get employee by ID
 * @param {String} id - Employee ID
 */
export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id);
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }
  return employee;
};

/**
 * Update employee
 * @param {String} id - Employee ID
 * @param {Object} data - Fields to update
 */
export const updateEmployee = async (id, data) => {
  const employee = await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }
  return employee;
};

/**
 * Delete employee (only admin can delete)
 * @param {String} id - Employee ID
 * @param {String} requesterId - ID of the admin performing deletion
 */
export const deleteEmployee = async (id, requesterId) => {
  if (!requesterId) {
    const error = new Error("Only admins can delete employees");
    error.statusCode = 403;
    throw error;
  }

  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  return;
};
