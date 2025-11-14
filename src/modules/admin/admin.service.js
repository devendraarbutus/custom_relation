import Admin from "../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export default {
  adminSignupService: async (data) => {
    const { adminName, email, password, role } = data;

    // Duplicate check
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      const error = new Error("Admin  email already exists");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const admin = await Admin.create({
      adminName,
      email,
      password: hashedPassword,
      role
    });

    return {
      id: admin._id,
      adminName: admin.adminName,
      email: admin.email,
      role: admin.role
    };
  },


  adminLoginService: async (email, password) => {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return { token };
  },


  getAdminsService: async ({ roleFilter, page, limit, search }) => {
    const query = {
      role: { $in: roleFilter },
      $or: [
        { adminName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    const skip = (page - 1) * limit;

    const admins = await Admin.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(query);

    return {
      total,
      page,
      limit,
      admins,
      totalPages: Math.ceil(total / limit)
    };
  }
};
