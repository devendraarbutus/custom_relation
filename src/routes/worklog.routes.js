import express from "express";
import workLogController from "../modules/worklog/worklog.controller.js";

const router = express.Router();

// ------------------------------
// Timer routes
// ------------------------------
router.post("/timer", workLogController.handleTimer);

// ------------------------------
// Logs routes
// ------------------------------
router.get("/employee/:employeeId", workLogController.getLogsByEmployee);
router.get("/task/:taskId", workLogController.getLogsByTask);

// ------------------------------
// Summary routes
// ------------------------------
router.get("/summary/today/:employeeId", workLogController.getTodaySummary);
router.get("/summary/weekly/:employeeId", workLogController.getWeeklySummary);
router.get("/summary/monthly/:employeeId", workLogController.getMonthlySummary);
router.get("/summary/task/:taskId", workLogController.getTaskSummary);

// ------------------------------
// Admin: All logs
// ------------------------------
router.get("/", workLogController.getAllLogs);

export default router;
