import express from "express";
import workLogController from "../modules/worklog/worklog.controller.js";

const router = express.Router();

router.post("/timer", workLogController.handleTimer);

router.get("/employee/:employeeId", workLogController.getLogsByEmployee);
router.get("/task/:taskId", workLogController.getLogsByTask);

export default router;
