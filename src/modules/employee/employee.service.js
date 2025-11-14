import Employee from "../../models/employee.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export default {
  createEmployeeService: async (data) => {
    const { employeeName, email, mobile, password, createdBy } = data;

    const existingEmployee = await Employee.findOne({ email }).select("+password");
    if (existingEmployee) {
      const error = new Error("Email already exists, please use another email");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const employee = new Employee({
      employeeName,
      email,
      mobile,
      password: hashedPassword,
      createdBy,
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
    if (data.email) {
      const existing = await Employee.findOne({ email: data.email, _id: { $ne: id } });
      if (existing) {
        const error = new Error("Email already exists, please use another email");
        error.statusCode = 400;
        throw error;
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password.trim(), 10);
    }

    const employee = await Employee.findByIdAndUpdate(id, data, { new: true }).select("-password");
    if (!employee) {
      const error = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }

    return employee;
  },

  deleteEmployeeService: async (id) => {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      const error = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }
  },

  getAllEmployeesService: async () => {
    return await Employee.find().select("-password");
  },

  getEmployeeByIdService: async (id) => {
    const employee = await Employee.findById(id).select("-password");
    if (!employee) {
      const error = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }
    return employee;
  },

  employeeLoginService: async (email, password) => {
    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!employee.password) {
      const error = new Error("Employee has no password set");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return {
      token,
      employee: {
        id: employee._id,
        email: employee.email,
        role: employee.role,
        employeeName: employee.employeeName,
      },
    };
  },
};
