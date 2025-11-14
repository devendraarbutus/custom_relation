import * as TaskService from "./task.service.js";

export const createTask = (req, res) => TaskService.createTask(req.user.id, req.body, res);
export const getAllTasks = (req, res) => TaskService.getAllTasks(req.query, res);
export const getTaskById = (req, res) => TaskService.getTaskById(req.params.id, res);
export const updateTaskStatus = (req, res) => TaskService.updateTaskStatus(req.params.id, req.body.status, res);
export const deleteTask = (req, res) => TaskService.deleteTask(req.params.id, res);
