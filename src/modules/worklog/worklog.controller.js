import workLogService from "./worklog.service.js";

const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error("WorkLog Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const sendResponse = (res, data) => {
  res.status(200).json({ success: true, data });
};

export const handleTimer = asyncHandler(async (req, res) => {
  const { employeeId, taskId, action, notes } = req.body;

  if (!employeeId || !taskId || !action) {
    return res.status(400).json({
      success: false,
      message: "employeeId, taskId and action are required",
    });
  }

  if (!["start", "stop"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Invalid action. Must be 'start' or 'stop'",
    });
  }

  const result =
    action === "start"
      ? await workLogService.startTimer(employeeId, taskId)
      : await workLogService.stopTimer(employeeId, taskId, notes || "");

  return res.status(result.success ? 200 : 400).json(result);
});

export const getLogsByEmployee = asyncHandler(async (req, res) => {
  const logs = await workLogService.getEmployeeLogs(req.params.employeeId);
  sendResponse(res, logs);
});

export const getLogsByTask = asyncHandler(async (req, res) => {
  const logs = await workLogService.getTaskLogs(req.params.taskId);
  sendResponse(res, logs);
});

export const getTodaySummary = asyncHandler(async (req, res) => {
  const summary = await workLogService.getTodaySummary(req.params.employeeId);
  sendResponse(res, summary);
});

export const getWeeklySummary = asyncHandler(async (req, res) => {
  const summary = await workLogService.getWeeklySummary(req.params.employeeId);
  sendResponse(res, summary);
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const summary = await workLogService.getMonthlySummary(req.params.employeeId);
  sendResponse(res, summary);
});

export const getTaskSummary = asyncHandler(async (req, res) => {
  const summary = await workLogService.getTaskSummary(req.params.taskId);
  sendResponse(res, summary);
});

export const getAllLogs = asyncHandler(async (req, res) => {
  const logs = await workLogService.getAllLogs();
  sendResponse(res, logs);
});

export default {
  handleTimer,
  getLogsByEmployee,
  getLogsByTask,
  getTodaySummary,
  getWeeklySummary,
  getMonthlySummary,
  getTaskSummary,
  getAllLogs,
};
