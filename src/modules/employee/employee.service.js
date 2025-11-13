import Employee from "../../models/employee.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;
export default {
  createEmployeeService: async (data) => {
    const { employeeName, email, mobile, password, createdBy } = data;
    const trimmedPassword = password.trim();

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      const error = new Error('Email already exists, please use another email');
      error.statusCode = 400;
      throw error;
    }
    
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const employee = new Employee({
      employeeName,
      email,
      mobile,
      password: hashedPassword,
      createdBy, // admin._id passed from controller
    });

    await employee.save();

    return {
      id: employee._id,
      employeeName: employee.employeeName,
      email: employee.email,
      mobile: employee.mobile,
      role: employee.role,
      status: employee.status,
      createdBy: employee.createdBy,
    };

  },
  updateEmployeeService: async (id, data) => {
    // Check if email is being updated
    if (data.email) {
      const existing = await Employee.findOne({ email: data.email, _id: { $ne: id } });
      if (existing) {
        const error = new Error('Email already exists, please use another email');
        error.statusCode = 400;
        throw error;
      }
    }

    // Hash password if it's being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password.trim(), 10);
    }

    const employee = await Employee.findByIdAndUpdate(id, data, { new: true }).select('-password');
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    return employee;
  },
  deleteEmployeeService: async (id) => {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }
    return;
  },
  getAllEmployeesService: async () => {
    // Return all employees, exclude password
    const employees = await Employee.find().select('-password');
    return employees;
  },

  getEmployeeByIdService: async (id) => {
    const employee = await Employee.findById(id).select('-password');
    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }
    return employee;
  },
  employeeLoginService: async (email, password) => {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { _id: employee._id, role: employee.role },
      JWT_SECRET,
      { expiresIn: '12D' }
    );

    return { token, employee: { id: employee._id, email: employee.email, role: employee.role } };
  },
}