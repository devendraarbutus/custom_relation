import express from "express";
import * as employeeController from "../modules/employee/employee.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminauth.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create employee
router.post("/", adminAuthMiddleware, employeeController.createEmployee);

// Update employee
router.put("/:id", adminAuthMiddleware, employeeController.updateEmployee);

// Delete employee
router.delete("/:id", adminAuthMiddleware, employeeController.deleteEmployee);

// Get all employees
router.get("/", verifyToken, employeeController.getAllEmployees);

// Get employee by ID
router.get("/:id", verifyToken, employeeController.getEmployeeById);

export default router;
