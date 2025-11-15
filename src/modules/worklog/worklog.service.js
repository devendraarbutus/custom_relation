import WorkLog from "../../models/worklog.model.js";
import Task from "../../models/task.model.js";

// -------------------- Helpers --------------------

// Format milliseconds → "X hr Y min"
const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "0 min";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

// Calculate total work + total break from a single worklog
const calculateDurations = (log) => {
  let totalWork = 0;
  let totalBreak = 0;

  log?.timer.forEach((t) => {
    if (t.startTime && t.endTime) totalWork += new Date(t.endTime) - new Date(t.startTime);
  });

  log?.breaks.forEach((b) => {
    if (b.startTime && b.endTime) totalBreak += new Date(b.endTime) - new Date(b.startTime);
  });

  return { totalWork, totalBreak };
};

// -------------------- Timer --------------------

const startTimer = async (employeeId, taskId) => {
  let log = await WorkLog.findOne({ employeeId, taskId });
  if (!log) log = new WorkLog({ employeeId, taskId, timer: [], breaks: [] });

  if (log.timer.some((t) => !t.endTime)) {
    return { success: false, message: "Timer already running" };
  }

  const now = new Date();

  // Record break if previous timer stopped
  if (log.lastStopTime instanceof Date) {
    const duration = now - log.lastStopTime;
    if (duration > 0) log.breaks.push({ startTime: log.lastStopTime, endTime: now });
    log.lastStopTime = null;
  }

  log.timer.push({ startTime: now });
  await log.save();
  return { success: true, message: "Work timer started" };
};

const stopTimer = async (employeeId, taskId, notes = "") => {
  const log = await WorkLog.findOne({ employeeId, taskId });
  if (!log) return { success: false, message: "WorkLog not found" };

  // Remove any invalid breaks
  log.breaks = log.breaks.filter((b) => b.startTime instanceof Date && b.endTime instanceof Date);

  const running = log.timer.find((t) => !t.endTime);
  if (!running) return { success: false, message: "No running timer" };

  const now = new Date();
  running.endTime = now;
  if (notes.trim()) running.notes = notes.trim();

  // Record break if lastStopTime exists
  if (log.lastStopTime instanceof Date) {
    const duration = now - log.lastStopTime;
    if (duration > 0) log.breaks.push({ startTime: log.lastStopTime, endTime: now });
  }

  log.lastStopTime = now;
  await log.save();

  return { success: true, message: "Work timer stopped" };
};

// Notes only allowed when stopping timer
const addNotes = async () => ({
  success: false,
  message: "Notes can only be added when stopping the timer.",
});

// -------------------- Summaries --------------------

// Task-wise summary with admin info
const getTaskWiseDetails = async (logs) => {
  const taskMap = {};

  for (const log of logs) {
    let taskObj = log.taskId; // already populated
    if (!taskObj) continue;

    // Populate createdBy if it's just an ID
    if (taskObj.createdBy && typeof taskObj.createdBy === "string") {
      const populated = await Task.findById(taskObj._id).populate("createdBy", "name email");
      taskObj = populated || taskObj;
    }

    const taskId = taskObj._id.toString();

    if (!taskMap[taskId]) {
      taskMap[taskId] = {
        taskId,
        taskName: taskObj.title || "Unknown Task",
        taskDescription: taskObj.description || "",
        createdBy: taskObj.createdBy
          ? {
              _id: taskObj.createdBy._id,
              name: taskObj.createdBy.name,
              email: taskObj.createdBy.email,
            }
          : null,
        totalWork: 0,
        totalBreak: 0,
        totalWorkFormatted: "0 min",
        totalBreakFormatted: "0 min",
      };
    }

    const { totalWork, totalBreak } = calculateDurations(log);

    taskMap[taskId].totalWork += totalWork;
    taskMap[taskId].totalBreak += totalBreak;
    taskMap[taskId].totalWorkFormatted = formatDuration(taskMap[taskId].totalWork);
    taskMap[taskId].totalBreakFormatted = formatDuration(taskMap[taskId].totalBreak);
  }

  return Object.values(taskMap);
};

// Employee summary
const getEmployeeTaskSummary = async (employeeId, filter = {}) => {
  const logs = await WorkLog.find({ employeeId, ...filter }).populate("taskId", "title description createdBy");
  const tasks = await getTaskWiseDetails(logs);

  const totalWork = tasks.reduce((sum, t) => sum + t.totalWork, 0);
  const totalBreak = tasks.reduce((sum, t) => sum + t.totalBreak, 0);

  return {
    success: true,
    summary: {
      totalWork,
      totalWorkFormatted: formatDuration(totalWork),
      totalBreak,
      totalBreakFormatted: formatDuration(totalBreak),
      totalTasks: tasks.length,
      tasks,
    },
  };
};

// Daily / Weekly / Monthly summaries
const getTodaySummary = (employeeId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return getEmployeeTaskSummary(employeeId, { updatedAt: { $gte: start } });
};

const getWeeklySummary = (employeeId) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return getEmployeeTaskSummary(employeeId, { updatedAt: { $gte: weekStart } });
};

const getMonthlySummary = (employeeId) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return getEmployeeTaskSummary(employeeId, { updatedAt: { $gte: monthStart } });
};

// Task-specific summary
const getTaskSummary = async (taskId) => {
  const logs = await WorkLog.find({ taskId }).populate("taskId", "title description createdBy");
  if (!logs.length) return { success: false, message: "No logs for this task" };

  const tasks = await getTaskWiseDetails(logs);
  const totalWork = tasks.reduce((sum, t) => sum + t.totalWork, 0);
  const totalBreak = tasks.reduce((sum, t) => sum + t.totalBreak, 0);

  return {
    success: true,
    summary: {
      totalWork,
      totalWorkFormatted: formatDuration(totalWork),
      totalBreak,
      totalBreakFormatted: formatDuration(totalBreak),
      totalTasks: tasks.length,
      tasks,
    },
  };
};

// -------------------- Export --------------------
export default {
  startTimer,
  stopTimer,
  addNotes,
  getTodaySummary,
  getWeeklySummary,
  getMonthlySummary,
  getTaskSummary,
};
