import Task from "../../models/task.model.js";
import Employee from "../../models/employee.model.js";

export const createTask = async (adminId, data) => {
  const { title, description, assignedTo, dueDate } = data;
  if (!title || !description || !assignedTo || !dueDate) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const employee = await Employee.findById(assignedTo);
  if (!employee || employee.status !== "active") {
    const error = new Error("Invalid or inactive employee");
    error.statusCode = 400;
    throw error;
  }

  return await Task.create({ title, description, assignedTo, createdBy: adminId, dueDate });
};

export const getAllTasks = async ({ page = 1, limit = 10, search = "", sort = { createdAt: -1 } } = {}) => {
  const query = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "adminName email")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  return tasks;
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "adminName email");

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

export const updateTaskStatus = async (id, status) => {
  if (!status) {
    const error = new Error("Status is required");
    error.statusCode = 400;
    throw error;
  }

  const allowedStatus = ["pending", "in-progress", "completed", "overdue"];
  if (!allowedStatus.includes(status)) {
    const error = new Error("Invalid status value");
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

export const deleteTask = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  await task.deleteOne();
  return true;
};
