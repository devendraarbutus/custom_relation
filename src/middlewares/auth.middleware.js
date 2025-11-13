import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Employee from "../models/employee.model.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    const admin = await Admin.findById(req.user.id);
    if (!admin || !["superadmin","admin","subadmin"].includes(admin.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  });
};

export const verifyEmployee = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    const employee = await Employee.findById(req.user.id);
    if (!employee || req.user.role !== "employee") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  });
};
