import WorkLog from "../../models/worklog.model.js";

export const startWork = async (employeeId, taskId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingLog = await WorkLog.findOne({
    employeeId,
    taskId,
    date: today,
    status: "in-progress"
  });

  if (existingLog) throw Object.assign(new Error("Work session already in progress for this task today"), { statusCode: 400 });

  return await WorkLog.create({
    employeeId,
    taskId,
    startTime: new Date(),
    date: today,
    status: "in-progress"
  });
};

export const addBreak = async (workLogId, breakData) => {
  const workLog = await WorkLog.findById(workLogId);
  if (!workLog) throw Object.assign(new Error("Work log not found"), { statusCode: 404 });

  workLog.breaks.push(breakData);
  await workLog.save();
  return workLog;
};

export const endWork = async (workLogId) => {
  const workLog = await WorkLog.findById(workLogId);
  if (!workLog) throw Object.assign(new Error("Work log not found"), { statusCode: 404 });
  if (workLog.status === "completed") throw Object.assign(new Error("Work session already completed"), { statusCode: 400 });

  workLog.endTime = new Date();

  const workedMs = workLog.endTime - workLog.startTime;
  const breakMs = workLog.breaks.reduce((sum, b) => sum + (new Date(b.end) - new Date(b.start)), 0);

  workLog.totalWorkedTime = parseFloat(((workedMs - breakMs) / 1000 / 60 / 60).toFixed(2));
  workLog.status = "completed";

  await workLog.save();
  return workLog;
};

export const addNote = async (workLogId, noteData) => {
  const workLog = await WorkLog.findById(workLogId);
  if (!workLog) throw Object.assign(new Error("Work log not found"), { statusCode: 404 });

  workLog.notes.push(noteData);
  await workLog.save();
  return workLog;
};

export const getWorkLogsByEmployee = async (employeeId, startDate, endDate) => {
  return await WorkLog.find({
    employeeId,
    date: { $gte: startDate, $lte: endDate }
  })
  .populate("taskId", "title")
  .sort({ date: -1 });
};

export const getAllWorkLogs = async (startDate, endDate) => {
  return await WorkLog.find({
    date: { $gte: startDate, $lte: endDate }
  })
  .populate("employeeId", "name email")
  .populate("taskId", "title")
  .sort({ date: -1 });
};
