import Task from "../../models/task.model.js";
import Employee from "../../models/employee.model.js";

// Create a task
export const createTask = async (adminId, data, res) => {
  try {
    const { title, description, assignedTo, dueDate } = data;
    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const employee = await Employee.findById(assignedTo);
    if (!employee || employee.status !== "active") {
      return res.status(400).json({ success: false, message: "Invalid or inactive employee" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: adminId,
      dueDate
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    return res.status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

// Get all tasks (with search + status filter)
export const getAllTasks = async (queryParams, res) => {
  try {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const search = queryParams.search || "";
    const sortField = queryParams.sortBy || "createdAt";
    const sortOrder = queryParams.order === "asc" ? 1 : -1;
    const status = queryParams.status || "";

    // Base query
    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ]
        }
      ]
    };

    // Add STATUS filter if provided
    if (status) {
      query.$and.push({
        status: { $regex: `^${status}$`, $options: "i" } // case-insensitive match
      });
    }

    console.log("FINAL QUERY = ", JSON.stringify(query, null, 2));

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "adminName email")
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      tasks,
      page,
      limit,
      count: tasks.length,
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get task by ID
export const getTaskById = async (id, res) => {
  try {
    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "adminName email");

    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    return res.status(200).json({ success: true, task });

  } catch (error) {
    return res.status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (id, status, res) => {
  try {
    const allowedStatus = ["pending", "in-progress", "completed", "overdue"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    return res.status(200).json({
      success: true,
      message: "Status updated",
      task
    });

  } catch (error) {
    return res.status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

// Delete a task
export const deleteTask = async (id, res) => {
  try {
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    return res.status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};
