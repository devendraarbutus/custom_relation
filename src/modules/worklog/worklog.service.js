import WorkLog from "../../models/worklog.model.js";

// Start a timer: push a new object into timer array
const startTimer = async (employeeId, taskId) => {
  let log = await WorkLog.findOne({ employeeId, taskId });

  if (!log) {
    log = new WorkLog({ employeeId, taskId, timer: [] });
  }

  const runningTimer = log.timer.find(t => !t.endTime);
  if (runningTimer) {
    return { success: false, message: "Timer already running for this task" };
  }

  log.timer.push({ startTime: new Date() });
  await log.save();
  return { success: true, message: "Timer started" };
};

// Stop a timer: update the endTime of the last running timer
const stopTimer = async (employeeId, taskId) => {
  const log = await WorkLog.findOne({ employeeId, taskId });
  if (!log) return { success: false, message: "No log found for this task" };

  const runningTimer = log.timer.find(t => !t.endTime);
  if (!runningTimer) return { success: false, message: "No running timer found" };

  runningTimer.endTime = new Date();
  await log.save();
  return { success: true, message: "Timer stopped" };
};

// Add notes to the last timer entry
const addNotes = async (employeeId, taskId, notes) => {
  const log = await WorkLog.findOne({ employeeId, taskId });
  if (!log) return { success: false, message: "No log found for this task" };

  const lastTimer = log.timer[log.timer.length - 1];
  if (!lastTimer) return { success: false, message: "No timer to add notes" };

  lastTimer.notes = notes;
  await log.save();
  return { success: true, message: "Notes added" };
};

// Unified handler
const handleTimer = async (req, res) => {
  try {
    const { employeeId, taskId, action, notes } = req.body;

    if (!employeeId || !taskId || !action) {
      return res.status(400).json({ success: false, message: "employeeId, taskId and action are required" });
    }

    let response;
    if (action === "start") response = await startTimer(employeeId, taskId);
    else if (action === "stop") response = await stopTimer(employeeId, taskId);
    else return res.status(400).json({ success: false, message: "Invalid action" });

    if (notes && response.success) {
      await addNotes(employeeId, taskId, notes);
      response.message += " and notes added";
    }

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all logs by employee
const getEmployeeLogs = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const logs = await WorkLog.find({ employeeId });
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all logs by task
const getTaskLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const logs = await WorkLog.find({ taskId });
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  handleTimer,
  getEmployeeLogs,
  getTaskLogs,
  startTimer,
  stopTimer,
  addNotes
};
