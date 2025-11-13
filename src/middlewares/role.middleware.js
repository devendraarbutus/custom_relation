export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
// src/routes/employee.routes.js
import express from "express";
import * as employeeController from "../modules/employee/employee.controller.js";

// import your existing middlewares
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// ✅ Only admin can create, update, and delete employees
router.post("/", verifyToken, isAdmin, employeeController.createEmployee);
router.put("/:id", verifyToken, isAdmin, employeeController.updateEmployee);
router.delete("/:id", verifyToken, isAdmin, employeeController.deleteEmployee);

// ✅ Optional: employees or admins can view
router.get("/", verifyToken, employeeController.getAllEmployees);
router.get("/:id", verifyToken, employeeController.getEmployeeById);

export default router;
