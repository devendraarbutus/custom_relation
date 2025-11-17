import WorkLog from "../../models/worklog.model.js";
import Task from "../../models/task.model.js";
import Employee from "../../models/employee.model.js";

// -----------------------------
// UTILITIES
// -----------------------------
const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "0 min";
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h} hr ${min} min` : `${min} min`;
};

const capBreakToSameDay = (br) => {
  if (!br.startTime || !br.endTime) return br;
  const start = new Date(br.startTime);
  const end = new Date(br.endTime);
  if (start.toDateString() === end.toDateString()) return br;

  const capped = new Date(start);
  capped.setHours(23, 59, 59, 999);
  br.endTime = capped;
  return br;
};

const calculateDurations = (log) => {
  let totalWork = 0;
  let totalBreak = 0;

  for (const t of log.timer || []) {
    if (t.startTime && t.endTime)
      totalWork += new Date(t.endTime) - new Date(t.startTime);
  }

  for (const b of log.breaks || []) {
    if (b.startTime && b.endTime) {
      const clean = capBreakToSameDay(b);
      totalBreak += new Date(clean.endTime) - new Date(clean.startTime);
    }
  }

  return { totalWork, totalBreak };
};

// -----------------------------
// TIMER HANDLERS
// -----------------------------
const startTimer = async (employeeId, taskId) => {
  let log = await WorkLog.findOne({ employeeId, taskId });

  if (!log)
    log = new WorkLog({
      employeeId,
      taskId,
      timer: [],
      breaks: [],
      lastStopTime: null,
    });

  if (log.timer.some((t) => !t.endTime))
    return { success: false, message: "Timer already running" };

  const now = new Date();

  // Convert previous stopTime → break
  if (log.lastStopTime instanceof Date) {
    log.breaks.push({ startTime: log.lastStopTime, endTime: now });
    log.lastStopTime = null;
  }

  log.timer.push({ startTime: now });
  await log.save();

  return { success: true, message: "Work timer started" };
};

const stopTimer = async (employeeId, taskId, notes = "") => {
  const log = await WorkLog.findOne({ employeeId, taskId });
  if (!log) return { success: false, message: "WorkLog not found" };

  const running = log.timer.find((t) => !t.endTime);
  if (!running) return { success: false, message: "No running timer" };

  const now = new Date();
  running.endTime = now;

  if (notes.trim()) running.notes = notes.trim();

  if (log.lastStopTime instanceof Date)
    log.breaks.push({ startTime: log.lastStopTime, endTime: now });

  log.lastStopTime = now;

  await log.save();
  return { success: true, message: "Work timer stopped" };
};

// -----------------------------
// TASK WISE DETAILS
// -----------------------------
const getTaskWiseDetails = async (logs) => {
  const map = {};

  for (const log of logs) {
    const task = log.taskId;
    if (!task) continue;

    const id = String(task._id);

    if (!map[id]) {
      map[id] = {
        taskId: id,
        taskName: task.title,
        taskDescription: task.description,
        createdBy: task.createdBy
          ? {
              _id: task.createdBy._id,
              name: task.createdBy.adminName,
              email: task.createdBy.email,
            }
          : null,
        totalWork: 0,
        totalBreak: 0,
        totalWorkFormatted: "0 min",
        totalBreakFormatted: "0 min",
      };
    }

    const { totalWork, totalBreak } = calculateDurations(log);
    map[id].totalWork += totalWork;
    map[id].totalBreak += totalBreak;

    map[id].totalWorkFormatted = formatDuration(map[id].totalWork);
    map[id].totalBreakFormatted = formatDuration(map[id].totalBreak);
  }

  return Object.values(map);
};

// -----------------------------
// EMPLOYEE TASK SUMMARY
// -----------------------------
const getEmployeeTaskSummary = async (employeeId, filter = {}) => {
  const logs = await WorkLog.find({ employeeId, ...filter })
    .populate({
      path: "employeeId",
      model: "employee",
      select: "_id employeeName email",
    })
    .populate({
      path: "taskId",
      model: "Task",
      select: "title description createdBy",
      populate: { path: "createdBy", select: "_id adminName email" },
    })
    .lean();

  const employee = logs.length ? logs[0].employeeId : null;
  const tasks = await getTaskWiseDetails(logs);

  const totalWork = tasks.reduce((s, t) => s + t.totalWork, 0);
  const totalBreak = tasks.reduce((s, t) => s + t.totalBreak, 0);

  return {
    success: true,
    summary: {
      employee: employee
        ? {
            _id: employee._id,
            name: employee.employeeName,
            email: employee.email,
          }
        : null,
      totalWork,
      totalWorkFormatted: formatDuration(totalWork),
      totalBreak,
      totalBreakFormatted: formatDuration(totalBreak),
      totalTasks: tasks.length,
      tasks,
    },
  };
};

// -----------------------------
// FIXED DATE FILTERS (correct filtering)
// -----------------------------
const buildDateFilter = (start) => ({
  $or: [
    { "timer.startTime": { $gte: start } },
    { "timer.endTime": { $gte: start } },
    { "breaks.startTime": { $gte: start } },
    { "breaks.endTime": { $gte: start } },
  ],
});

const getTodaySummary = (employeeId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return getEmployeeTaskSummary(employeeId, buildDateFilter(start));
};

const getWeeklySummary = (employeeId) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return getEmployeeTaskSummary(employeeId, buildDateFilter(weekStart));
};

const getMonthlySummary = (employeeId) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return getEmployeeTaskSummary(employeeId, buildDateFilter(monthStart));
};

// -----------------------------
// TASK SUMMARY
// -----------------------------
const getTaskSummary = async (taskId) => {
  const logs = await WorkLog.find({ taskId })
    .populate("employeeId", "_id employeeName email")
    .populate({
      path: "taskId",
      select: "title description createdBy",
      populate: { path: "createdBy", select: "_id adminName email" },
    })
    .lean();

  if (!logs.length) return { success: false, message: "No logs for this task" };

  const tasks = await getTaskWiseDetails(logs);

  return {
    success: true,
    summary: {
      taskId,
      employees: logs.map((l) => ({
        _id: l.employeeId?._id,
        name: l.employeeId?.employeeName,
        email: l.employeeId?.email,
      })),
      totalTasks: tasks.length,
      ...tasks[0],
    },
  };
};

// -----------------------------
// BASIC LOG GETTERS
// -----------------------------
const getEmployeeLogs = (employeeId) =>
  WorkLog.find({ employeeId }).sort({ updatedAt: -1 });

const getTaskLogs = (taskId) =>
  WorkLog.find({ taskId }).sort({ updatedAt: -1 });

const getAllLogs = () =>
  WorkLog.find().populate("taskId employeeId").sort({ updatedAt: -1 });

export default {
  startTimer,
  stopTimer,
  addNotes: async () => ({
    success: false,
    message: "Notes can only be added when stopping the timer.",
  }),
  getEmployeeLogs,
  getTaskLogs,
  getAllLogs,
  getTodaySummary,
  getWeeklySummary,
  getMonthlySummary,
  getTaskSummary,
};
