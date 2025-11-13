import * as TaskService from "./task.service.js";

export const createTask = async (req, res) => {
  try {
    const result = await TaskService.createTask(req.user.id, req.body);
    res.status(201).json({ success: true, message: "Task created successfully", task: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const tasks = await TaskService.getAllTasks({
      page,
      limit,
      search,
      sort: { [sortField]: sortOrder },
    });

    res.status(200).json({
      success: true,
      page,
      limit,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await TaskService.updateTaskStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: "Status updated", task });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await TaskService.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
