import Admin from "../../models/admin.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

export default {
    adminSignupService: async (data) => {
        const { adminName, email, password, role } = data;
        const trimmedPassword = password.trim();

    // Check if adminName or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ adminName }, { email }],
    });

    if (existingAdmin) {
      if (existingAdmin.adminName === adminName) {
        const error = new Error('Admin already exists, please choose another one');
        error.statusCode = 400;
        throw error;
      } else if (existingAdmin.email === email) {
        const error = new Error('Email already exists, please use another email');
        error.statusCode = 400;
        throw error;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(trimmedPassword,10);

    // Create new admin
    const admin = new Admin({
      adminName,
      email,
      password: hashedPassword,
      role, 
    });

    await admin.save();

    return {
      id: admin._id,
      adminName: admin.adminName,
      email: admin.email,
      role: admin.role,
    };
    },
    adminLoginService: async (identifier, password) => {
    const admin = await Admin.findOne({
      $or: [{ adminName: identifier }, { email: identifier }],
    });

    if (!admin) {
      const error = new Error('Invalid adminName or Email');
      error.statusCode = 400;
      throw error;
    }

    // Trim and compare password
    const trimmedPassword = password.trim();
    const isMatch = await bcrypt.compare(trimmedPassword, admin.password);
    if (!isMatch) {
      const error = new Error('Invalid password');
      error.statusCode = 400;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Return safe fields + token
    return {
      id: admin._id,
      adminName: admin.adminName,
      email: admin.email,
      role: admin.role,
      token,
    };
},
  getAdminsService: async (roleFilter) => {
    // If roleFilter is provided, filter by role
    const query = roleFilter ? { role: { $in: roleFilter } } : {};
    const admins = await Admin.find(query).select('-password'); // exclude passwords
    return admins;
  },
}