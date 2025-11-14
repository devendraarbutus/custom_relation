import express from "express";
import employeeController from "../modules/employee/employee.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", employeeController.employeeLogin);

router.post("/", verifyAdmin, employeeController.createEmployee);
router.put("/:id", verifyAdmin, employeeController.updateEmployee);
router.delete("/:id", verifyAdmin, employeeController.deleteEmployee);
router.get("/", verifyAdmin, employeeController.getAllEmployees);
router.get("/:id", verifyAdmin, employeeController.getEmployeeById);

export default router;
