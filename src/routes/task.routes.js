import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  deleteTask,
} from "../modules/task/task.controller.js";

const router = express.Router();

router.post("/create", verifyAdmin, createTask);
router.get("/", verifyAdmin, getAllTasks);
router.get("/:id", verifyAdmin, getTaskById);
router.put("/:id/status", verifyToken, updateTaskStatus);
router.delete("/:id", verifyAdmin, deleteTask);

export default router;
