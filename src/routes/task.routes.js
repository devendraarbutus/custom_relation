import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import * as TaskController from "../modules/task/task.controller.js";

const router = express.Router();

// Task CRUD routes
router.post("/", verifyAdmin, TaskController.createTask);          // Create a task
router.get("/", verifyAdmin, TaskController.getAllTasks);          // Get all tasks
router.get("/:id", verifyAdmin, TaskController.getTaskById);       // Get single task
router.put("/:id/status", verifyToken, TaskController.updateTaskStatus); // Update task status
router.delete("/:id", verifyAdmin, TaskController.deleteTask);     // Delete a task

export default router;
