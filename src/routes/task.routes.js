import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import * as TaskController from "../modules/task/task.controller.js";

const router = express.Router();

// Task CRUD routes
router.post("/", verifyAdmin, TaskController.createTask);                
router.get("/", verifyAdmin, TaskController.getAllTasks);                
router.get("/:id", verifyAdmin, TaskController.getTaskById);             
router.put("/:id/status", verifyToken, TaskController.updateTaskStatus); 
router.delete("/:id", verifyAdmin, TaskController.deleteTask);           

export default router;
