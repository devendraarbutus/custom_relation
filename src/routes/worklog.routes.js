import express from "express";
import { verifyAdmin, verifyEmployee } from "../middlewares/auth.middleware.js";
import * as WorkLogController from "../modules/worklog/worklog.controller.js";

const router = express.Router();

// Employee routes
router.post("/start", verifyEmployee, WorkLogController.startWork);
router.put("/break/:id", verifyEmployee, WorkLogController.addBreak);
router.put("/end/:id", verifyEmployee, WorkLogController.endWork);
router.put("/note/:id", verifyEmployee, WorkLogController.addNote);
router.get("/mylogs", verifyEmployee, WorkLogController.getWorkLogsByEmployee);

// Admin routes
router.get("/", verifyAdmin, WorkLogController.getAllWorkLogs);

export default router;
