import Admin from "../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 🧩 ADMIN SERVICE
 * Handles DB operations for admin module
 */
const adminService = {
  /**
   * @desc Creates a new admin account
   */
  adminSignupService: async (data) => {
    const { adminName, email, password, role = "admin" } = data;

    // Validate required fields
    if (!adminName || !email || !password) {
      const error = new Error("All fields (adminName, email, password) are required");
      error.statusCode = 400;
      throw error;
    }

    // Check for existing admin
    const existingAdmin = await Admin.findOne({
      $or: [{ adminName }, { email }],
    });

    if (existingAdmin) {
      let message = "";
      if (existingAdmin.adminName === adminName)
        message = "Admin name already exists, please choose another one";
      else if (existingAdmin.email === email)
        message = "Email already exists, please use another email";

      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Create and save admin
    const admin = await Admin.create({
      adminName,
      email,
      password: hashedPassword,
      role,
    });

    return {
      id: admin._id,
      adminName: admin.adminName,
      email: admin.email,
      role: admin.role,
    };
  },

  /**
   * @desc Validates admin credentials and returns JWT token
   */
  adminLoginService: async (identifier, password) => {
    const admin = await Admin.findOne({
      $or: [{ adminName: identifier }, { email: identifier }],
    });

    if (!admin) {
      const error = new Error("Invalid admin name or email");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password.trim(), admin.password);
    if (!isMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return {
      id: admin._id,
      adminName: admin.adminName,
      email: admin.email,
      role: admin.role,
      token,
    };
  },
};

export default adminService;
